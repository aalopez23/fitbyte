import express, { Response } from 'express';
import { getDB } from '../createTable';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all goals for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;

    const goals = await db.all(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(goals.map((goal: any) => ({
      id: goal.id.toString(),
      title: goal.goal_name,
      isCompleted: goal.isCompleted === 1
    })));
  } catch (error: any) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create goal
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.userId!;

    if (!title) {
      return res.status(400).json({ error: 'Goal title is required' });
    }

    const db = await getDB();

    const result = await db.run(
      'INSERT INTO goals (user_id, goal_name, isCompleted) VALUES (?, ?, ?)',
      [userId, title, 0]
    );

    if (!result.lastID) {
      return res.status(500).json({ error: 'Failed to create goal' });
    }

    res.status(201).json({
      id: result.lastID.toString(),
      title,
      isCompleted: false
    });
  } catch (error: any) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update goal
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    const userId = req.userId!;

    const db = await getDB();

    // Verify ownership
    const goal = await db.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId]);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Update goal
    if (title !== undefined) {
      await db.run('UPDATE goals SET goal_name = ? WHERE id = ?', [title, id]);
    }
    if (isCompleted !== undefined) {
      await db.run('UPDATE goals SET isCompleted = ? WHERE id = ?', [isCompleted ? 1 : 0, id]);
    }

    res.json({ message: 'Goal updated successfully' });
  } catch (error: any) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete goal
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = await getDB();

    // Verify ownership
    const goal = await db.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId]);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await db.run('DELETE FROM goals WHERE id = ?', [id]);

    res.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

