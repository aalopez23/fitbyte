import { useState, useEffect } from 'react';
import { Workout, Exercise } from '../types/types';
import * as supabaseService from '../services/supabaseService';

export const useWorkouts = () => {
  const [workoutName, setWorkoutName] = useState<string>('');
  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('strength');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [sets, setSets] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [intensity, setIntensity] = useState<string>('n/a');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getWorkouts();
      setWorkouts(data);
    } catch (error: any) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    if (exerciseName.trim() !== '') {
      setCurrentExercises([
        ...currentExercises,
        {
          name: exerciseName.trim(),
          exerciseType,
          sets,
          reps,
          weight,
          distance,
          duration,
          speed,
          intensity,
        },
      ]);

      setExerciseName('');
      setSets(0);
      setWeight(0);
      setReps(0);
      setDistance(0);
      setDuration(0);
      setSpeed(0);
    }
  };

  const addWorkout = async (newWorkout?: Workout) => {
    try {
      if (newWorkout) {
        await supabaseService.createWorkout({
          name: newWorkout.name,
          exercises: newWorkout.exercises.map((ex) => ({
            name: ex.name,
            exerciseType: ex.exerciseType,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            distance: ex.distance,
            duration: ex.duration,
            speed: ex.speed,
            intensity: ex.intensity,
          })),
        });
        await loadWorkouts();
        return;
      }

      if (workoutName.trim() !== '' && currentExercises.length > 0) {
        await supabaseService.createWorkout({
          name: workoutName.trim(),
          exercises: currentExercises.map((ex) => ({
            name: ex.name,
            exerciseType: ex.exerciseType,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            distance: ex.distance,
            duration: ex.duration,
            speed: ex.speed,
            intensity: ex.intensity,
          })),
        });
        setWorkoutName('');
        setCurrentExercises([]);
        await loadWorkouts();
      }
    } catch (error: any) {
      console.error('Error creating workout:', error);
    }
  };

  const deleteExercise = (index: number) => {
    const updatedExercises = currentExercises.filter((_, i) => i !== index);
    setCurrentExercises(updatedExercises);
  };

  const deleteWorkout = async (index: number) => {
    try {
      const workout = workouts[index];
      if (workout && (workout as any).id) {
        await supabaseService.deleteWorkout((workout as any).id);
        await loadWorkouts();
      } else {
        const updatedWorkouts = workouts.filter((_, i) => i !== index);
        setWorkouts(updatedWorkouts);
      }
    } catch (error: any) {
      console.error('Error deleting workout:', error);
    }
  };

  const saveWorkouts = () => {
    loadWorkouts();
  };

  return {
    workoutName,
    setWorkoutName,
    exerciseName,
    setExerciseName,
    exerciseType,
    setExerciseType,
    sets,
    setSets,
    reps,
    setReps,
    weight,
    setWeight,
    distance,
    setDistance,
    duration,
    setDuration,
    speed,
    setSpeed,
    intensity,
    setIntensity,
    currentExercises,
    addExercise,
    deleteExercise,
    workouts,
    addWorkout,
    saveWorkouts,
    deleteWorkout,
    loading,
  };
};
