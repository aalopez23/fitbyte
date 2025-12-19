import express, { Response } from 'express';
import { getDB } from '../createTable';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get nutrition entries for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;
    const { date, startDate, endDate } = req.query;

    let query = 'SELECT * FROM nutrition WHERE user_id = ?';
    const params: any[] = [userId];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    } else if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const entries = await db.all(query, params);

    res.json(entries.map((entry: any) => ({
      id: entry.id,
      date: entry.date,
      mealType: entry.meal_type,
      foodName: entry.food_name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fats: entry.fats
    })));
  } catch (error: any) {
    console.error('Get nutrition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nutrition summary for date range
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const summary = await db.all(
      `SELECT 
        date,
        SUM(calories) as totalCalories,
        SUM(protein) as totalProtein,
        SUM(carbs) as totalCarbs,
        SUM(fats) as totalFats
       FROM nutrition 
       WHERE user_id = ? AND date BETWEEN ? AND ?
       GROUP BY date
       ORDER BY date DESC`,
      [userId, startDate, endDate]
    );

    res.json(summary);
  } catch (error: any) {
    console.error('Get nutrition summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create nutrition entry
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { date, mealType, foodName, calories, protein, carbs, fats } = req.body;
    const userId = req.userId!;

    if (!date || !mealType || !foodName || calories === undefined) {
      return res.status(400).json({ error: 'Date, mealType, foodName, and calories are required' });
    }

    const db = await getDB();

    const result = await db.run(
      `INSERT INTO nutrition (user_id, date, meal_type, food_name, calories, protein, carbs, fats) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, date, mealType, foodName, calories, protein || 0, carbs || 0, fats || 0]
    );

    if (!result.lastID) {
      return res.status(500).json({ error: 'Failed to create nutrition entry' });
    }

    res.status(201).json({
      id: result.lastID,
      date,
      mealType,
      foodName,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0
    });
  } catch (error: any) {
    console.error('Create nutrition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update nutrition entry
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { date, mealType, foodName, calories, protein, carbs, fats } = req.body;
    const userId = req.userId!;

    const db = await getDB();

    // Verify ownership
    const entry = await db.get('SELECT * FROM nutrition WHERE id = ? AND user_id = ?', [id, userId]);
    if (!entry) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }

    await db.run(
      `UPDATE nutrition 
       SET date = ?, meal_type = ?, food_name = ?, calories = ?, protein = ?, carbs = ?, fats = ?
       WHERE id = ?`,
      [date, mealType, foodName, calories, protein || 0, carbs || 0, fats || 0, id]
    );

    res.json({ message: 'Nutrition entry updated successfully' });
  } catch (error: any) {
    console.error('Update nutrition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete nutrition entry
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = await getDB();

    // Verify ownership
    const entry = await db.get('SELECT * FROM nutrition WHERE id = ? AND user_id = ?', [id, userId]);
    if (!entry) {
      return res.status(404).json({ error: 'Nutrition entry not found' });
    }

    await db.run('DELETE FROM nutrition WHERE id = ?', [id]);

    res.json({ message: 'Nutrition entry deleted successfully' });
  } catch (error: any) {
    console.error('Delete nutrition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

