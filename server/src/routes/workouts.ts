import express, { Response } from 'express';
import { getDB } from '../createTable';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all workouts for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDB();
    const userId = req.userId!;

    const workouts = await db.all(
      'SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Get exercises for each workout
    const workoutsWithExercises = await Promise.all(
      workouts.map(async (workout: any) => {
        const exercises = await db.all(
          'SELECT * FROM exercises WHERE workout_id = ?',
          [workout.id]
        );
        return {
          id: workout.id,
          name: workout.workout_name,
          exercises: exercises.map((ex: any) => ({
            name: ex.exercise_name,
            exerciseType: ex.exercise_type,
            sets: ex.sets > 0 ? ex.sets : undefined,
            reps: ex.rep_count > 0 ? ex.rep_count : undefined,
            weight: ex.weight_count > 0 ? ex.weight_count : undefined,
            distance: ex.distance_miles > 0 ? ex.distance_miles : undefined,
            duration: ex.duration_min > 0 ? ex.duration_min : undefined,
            speed: ex.speed_mph > 0 ? ex.speed_mph : undefined,
            intensity: ex.intensity_level !== 'n/a' ? ex.intensity_level : undefined,
          }))
        };
      })
    );

    res.json(workoutsWithExercises);
  } catch (error: any) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create workout
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, exercises } = req.body;
    const userId = req.userId!;

    if (!name || !exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ error: 'Workout name and exercises array are required' });
    }

    const db = await getDB();

    // Create workout
    const workoutResult = await db.run(
      'INSERT INTO workouts (user_id, workout_name) VALUES (?, ?)',
      [userId, name]
    );

    if (!workoutResult.lastID) {
      return res.status(500).json({ error: 'Failed to create workout' });
    }

    const workoutId = workoutResult.lastID;

    // Insert exercises
    for (const exercise of exercises) {
      await db.run(
        `INSERT INTO exercises (workout_id, exercise_name, exercise_type, sets, rep_count, weight_count, 
         distance_miles, duration_min, speed_mph, intensity_level) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          workoutId,
          exercise.name,
          exercise.exerciseType || 'strength',
          exercise.sets || 0,
          exercise.reps || 0,
          exercise.weight || 0,
          exercise.distance || 0,
          exercise.duration || 0,
          exercise.speed || 0,
          exercise.intensity || 'n/a'
        ]
      );
    }

    res.status(201).json({ message: 'Workout created successfully', id: workoutId });
  } catch (error: any) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete workout
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = await getDB();

    // Verify ownership
    const workout = await db.get('SELECT * FROM workouts WHERE id = ? AND user_id = ?', [id, userId]);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Delete workout (cascade will delete exercises)
    await db.run('DELETE FROM workouts WHERE id = ?', [id]);

    res.json({ message: 'Workout deleted successfully' });
  } catch (error: any) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log workout completion
router.post('/:id/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = await getDB();

    // Verify workout exists and belongs to user
    const workout = await db.get('SELECT * FROM workouts WHERE id = ? AND user_id = ?', [id, userId]);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Log workout
    await db.run(
      'INSERT INTO workout_logs (user_id, workout_id, date) VALUES (?, ?, datetime("now"))',
      [userId, id]
    );

    res.json({ message: 'Workout logged successfully' });
  } catch (error: any) {
    console.error('Log workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

