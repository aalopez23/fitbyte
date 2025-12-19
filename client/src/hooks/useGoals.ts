import { useState, useEffect } from 'react';
import { Goal } from '../types/types';
import * as supabaseService from '../services/supabaseService';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getGoals();
      setGoals(data);
    } catch (error: any) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Goal) => {
    try {
      await supabaseService.createGoal(goal.title);
      await loadGoals();
    } catch (error: any) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await supabaseService.deleteGoal(id);
      await loadGoals();
    } catch (error: any) {
      console.error('Error deleting goal:', error);
    }
  };

  const completeGoal = async (id: string) => {
    try {
      const goal = goals.find((g) => g.id === id);
      if (goal) {
        await supabaseService.updateGoal(id, { isCompleted: !goal.isCompleted });
        await loadGoals();
      }
    } catch (error: any) {
      console.error('Error updating goal:', error);
    }
  };

  return { goals, addGoal, deleteGoal, completeGoal, loading };
};
