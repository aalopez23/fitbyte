import express, { Response } from 'express';
import { getDB } from '../createTable';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get workout statistics
router.get('/workouts', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;
    const { days = 30 } = req.query;

    // Get workout logs for the past N days
    const logs = await db.all(
      `SELECT date(workout_logs.date) as date, COUNT(*) as count
       FROM workout_logs
       WHERE user_id = ? AND date(workout_logs.date) >= date('now', '-' || ? || ' days')
       GROUP BY date(workout_logs.date)
       ORDER BY date DESC`,
      [userId, days]
    );

    // Get total workouts
    const totalResult = await db.get(
      'SELECT COUNT(*) as total FROM workout_logs WHERE user_id = ?',
      [userId]
    );

    // Get workouts per week
    const weeklyStats = await db.all(
      `SELECT 
        strftime('%Y-%W', date) as week,
        COUNT(*) as count
       FROM workout_logs
       WHERE user_id = ? AND date >= date('now', '-12 weeks')
       GROUP BY week
       ORDER BY week DESC`,
      [userId]
    );

    res.json({
      total: totalResult?.total || 0,
      recentLogs: logs,
      weeklyStats
    });
  } catch (error: any) {
    console.error('Get workout stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nutrition statistics
router.get('/nutrition', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;
    const { days = 30 } = req.query;

    // Get daily nutrition totals
    const dailyStats = await db.all(
      `SELECT 
        date,
        SUM(calories) as totalCalories,
        SUM(protein) as totalProtein,
        SUM(carbs) as totalCarbs,
        SUM(fats) as totalFats
       FROM nutrition
       WHERE user_id = ? AND date >= date('now', '-' || ? || ' days')
       GROUP BY date
       ORDER BY date DESC`,
      [userId, days]
    );

    // Get average macros
    const avgResult = await db.get(
      `SELECT 
        AVG(total_cals) as avgCalories,
        AVG(total_protein) as avgProtein,
        AVG(total_carbs) as avgCarbs,
        AVG(total_fats) as avgFats
       FROM (
         SELECT 
           date,
           SUM(calories) as total_cals,
           SUM(protein) as total_protein,
           SUM(carbs) as total_carbs,
           SUM(fats) as total_fats
         FROM nutrition
         WHERE user_id = ? AND date >= date('now', '-' || ? || ' days')
         GROUP BY date
       )`,
      [userId, days]
    );

    res.json({
      dailyStats,
      averages: {
        calories: avgResult?.avgCalories || 0,
        protein: avgResult?.avgProtein || 0,
        carbs: avgResult?.avgCarbs || 0,
        fats: avgResult?.avgFats || 0
      }
    });
  } catch (error: any) {
    console.error('Get nutrition stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get goal completion statistics
router.get('/goals', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;

    const stats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completed
       FROM goals
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      total: stats?.total || 0,
      completed: stats?.completed || 0,
      completionRate: stats?.total > 0 ? (stats.completed / stats.total) * 100 : 0
    });
  } catch (error: any) {
    console.error('Get goal stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

