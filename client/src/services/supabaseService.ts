import { supabase } from '../lib/supabase';

// Workouts
export const getWorkouts = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data?.map((workout: any) => ({
    id: workout.id,
    name: workout.workout_name,
    exercises: workout.exercises?.map((ex: any) => ({
      name: ex.exercise_name,
      exerciseType: ex.exercise_type,
      sets: ex.sets || undefined,
      reps: ex.rep_count || undefined,
      weight: ex.weight_count || undefined,
      distance: ex.distance_miles || undefined,
      duration: ex.duration_min || undefined,
      speed: ex.speed_mph || undefined,
      intensity: ex.intensity_level !== 'n/a' ? ex.intensity_level : undefined,
    })) || [],
  })) || [];
};

export const createWorkout = async (workout: { name: string; exercises: any[] }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Create workout
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      workout_name: workout.name,
    })
    .select()
    .single();

  if (workoutError) throw workoutError;

  // Create exercises
  if (workout.exercises.length > 0) {
    const exercises = workout.exercises.map((ex) => ({
      workout_id: workoutData.id,
      exercise_name: ex.name,
      exercise_type: ex.exerciseType || 'strength',
      sets: ex.sets || 0,
      rep_count: ex.reps || 0,
      weight_count: ex.weight || 0,
      distance_miles: ex.distance || 0,
      duration_min: ex.duration || 0,
      speed_mph: ex.speed || 0,
      intensity_level: ex.intensity || 'n/a',
    }));

    const { error: exercisesError } = await supabase
      .from('exercises')
      .insert(exercises);

    if (exercisesError) throw exercisesError;
  }

  return workoutData;
};

export const deleteWorkout = async (id: string) => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const logWorkout = async (workoutId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: user.id,
      workout_id: workoutId,
    });

  if (error) throw error;
};

// Goals
export const getGoals = async () => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data?.map((goal: any) => ({
    id: goal.id,
    title: goal.goal_name,
    isCompleted: goal.is_completed,
  })) || [];
};

export const createGoal = async (title: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      goal_name: title,
      is_completed: false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.goal_name,
    isCompleted: data.is_completed,
  };
};

export const updateGoal = async (id: string, updates: { title?: string; isCompleted?: boolean }) => {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.goal_name = updates.title;
  if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;

  const { error } = await supabase
    .from('goals')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteGoal = async (id: string) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Nutrition
export const getNutrition = async (filters?: { date?: string; startDate?: string; endDate?: string }) => {
  let query = supabase
    .from('nutrition')
    .select('*')
    .order('date', { ascending: false });

  if (filters?.date) {
    query = query.eq('date', filters.date);
  } else if (filters?.startDate && filters?.endDate) {
    query = query.gte('date', filters.startDate).lte('date', filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map((entry: any) => ({
    id: entry.id,
    date: entry.date,
    mealType: entry.meal_type,
    foodName: entry.food_name,
    calories: entry.calories,
    protein: entry.protein,
    carbs: entry.carbs,
    fats: entry.fats,
  })) || [];
};

export const createNutritionEntry = async (entry: {
  date: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('nutrition')
    .insert({
      user_id: user.id,
      date: entry.date,
      meal_type: entry.mealType,
      food_name: entry.foodName,
      calories: entry.calories,
      protein: entry.protein || 0,
      carbs: entry.carbs || 0,
      fats: entry.fats || 0,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    date: data.date,
    mealType: data.meal_type,
    foodName: data.food_name,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fats: data.fats,
  };
};

export const deleteNutritionEntry = async (id: string) => {
  const { error } = await supabase
    .from('nutrition')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Stats
export const getWorkoutStats = async (days: number = 30) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: logs, error: logsError } = await supabase
    .from('workout_logs')
    .select('date, workout_id')
    .eq('user_id', user.id)
    .gte('date', startDateStr);

  if (logsError) throw logsError;

  // Group by date
  const logsByDate = logs?.reduce((acc: any, log: any) => {
    const date = log.date.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {}) || {};

  const recentLogs = Object.entries(logsByDate).map(([date, count]) => ({
    date,
    count,
  }));

  const { count: total } = await supabase
    .from('workout_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return {
    total: total || 0,
    recentLogs,
    weeklyStats: [], // Could implement if needed
  };
};

export const getNutritionStats = async (days: number = 30) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('nutrition')
    .select('date, calories, protein, carbs, fats')
    .eq('user_id', user.id)
    .gte('date', startDateStr)
    .order('date', { ascending: false });

  if (error) throw error;

  // Group by date
  const dailyStatsMap: any = {};
  data?.forEach((entry: any) => {
    const date = entry.date;
    if (!dailyStatsMap[date]) {
      dailyStatsMap[date] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }
    dailyStatsMap[date].calories += entry.calories;
    dailyStatsMap[date].protein += entry.protein;
    dailyStatsMap[date].carbs += entry.carbs;
    dailyStatsMap[date].fats += entry.fats;
  });

  const dailyStats = Object.entries(dailyStatsMap).map(([date, totals]: [string, any]) => ({
    date,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFats: totals.fats,
  }));

  // Calculate averages
  const dayCount = dailyStats.length;
  const averages = dailyStats.reduce(
    (acc, stat) => ({
      avgCalories: acc.avgCalories + stat.totalCalories / dayCount,
      avgProtein: acc.avgProtein + stat.totalProtein / dayCount,
      avgCarbs: acc.avgCarbs + stat.totalCarbs / dayCount,
      avgFats: acc.avgFats + stat.totalFats / dayCount,
    }),
    { avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFats: 0 }
  );

  return {
    dailyStats,
    averages: {
      calories: averages.avgCalories,
      protein: averages.avgProtein,
      carbs: averages.avgCarbs,
      fats: averages.avgFats,
    },
  };
};

export const getGoalStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .select('is_completed')
    .eq('user_id', user.id);

  if (error) throw error;

  const total = data?.length || 0;
  const completed = data?.filter((g: any) => g.is_completed).length || 0;

  return {
    total,
    completed,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
  };
};

