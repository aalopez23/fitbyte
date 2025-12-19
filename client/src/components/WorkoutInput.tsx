import React, { ChangeEvent } from 'react';
import { Exercise } from '../types/types';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface WorkoutInputProps {
  workoutName: string;
  setWorkoutName: (value: string) => void;
  exerciseName: string;
  setExerciseName: (value: string) => void;
  exerciseType: string;
  setExerciseType: (value: string) => void;
  sets: number;
  setSets: (value: number) => void;
  reps: number;
  setReps: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
  distance: number;
  setDistance: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  speed: number;
  setSpeed: (value: number) => void;
  intensity: string;
  setIntensity: (value: string) => void;
  addExercise: () => void;
  deleteExercise: (value: number) => void;
  currentExercises: Exercise[];
  addWorkout: () => Promise<boolean> | void;
  deleteWorkout: (index: number) => void;
  onClose?: () => void;
}

const WorkoutInput: React.FC<WorkoutInputProps> = ({
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
  addExercise,
  deleteExercise,
  currentExercises,
  addWorkout,
  onClose,
}) => {
  const handleWorkoutNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkoutName(e.target.value);
  };

  const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExerciseName(e.target.value);
  };

  const handleAddExercise = () => {
    addExercise();
  };

  const handleAddWorkout = async () => {
    const result = await addWorkout();
    if (result !== false && onClose) {
      onClose();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return '#ff6b6b';
      case 'cardio':
        return '#4ecdc4';
      case 'mindbody':
        return '#95e1d3';
      default:
        return '#95a5a6';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Create New Workout
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <TextField
        fullWidth
        label="Workout Name"
        value={workoutName}
        onChange={handleWorkoutNameChange}
        placeholder="e.g., Upper Body Strength"
        sx={{ mb: 3 }}
        required
      />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Add Exercises
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Exercise Type</InputLabel>
            <Select
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              label="Exercise Type"
            >
              <MenuItem value="strength">Strength Training</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="mindbody">Mind/Body</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Exercise Name"
            value={exerciseName}
            onChange={handleExerciseNameChange}
            placeholder="e.g., Bench Press"
          />
        </Grid>
      </Grid>

      {exerciseType === 'strength' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Sets"
              type="number"
              value={sets === 0 ? '' : sets}
              onChange={(e) => setSets(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Reps"
              type="number"
              value={reps === 0 ? '' : reps}
              onChange={(e) => setReps(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Weight (lbs)"
              type="number"
              value={weight === 0 ? '' : weight}
              onChange={(e) => setWeight(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
        </Grid>
      )}

      {exerciseType === 'cardio' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Distance (miles)"
              type="number"
              value={distance === 0 ? '' : distance}
              onChange={(e) => setDistance(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Duration (min)"
              type="number"
              value={duration === 0 ? '' : duration}
              onChange={(e) => setDuration(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Speed (mph)"
              type="number"
              value={speed === 0 ? '' : speed}
              onChange={(e) => setSpeed(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
        </Grid>
      )}

      {exerciseType === 'mindbody' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Duration (min)"
              type="number"
              value={duration === 0 ? '' : duration}
              onChange={(e) => setDuration(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Intensity</InputLabel>
              <Select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                label="Intensity"
              >
                <MenuItem value="n/a">Optional</MenuItem>
                <MenuItem value="Light">Light</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      <Button
        variant="outlined"
        onClick={handleAddExercise}
        startIcon={<AddIcon />}
        disabled={!exerciseName.trim()}
        sx={{ mb: 3 }}
        fullWidth
      >
        Add Exercise
      </Button>

      {currentExercises.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Added Exercises ({currentExercises.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {currentExercises.map((exercise, index) => {
              let details: string[] = [];
              if (exercise.exerciseType === 'strength') {
                if (exercise.sets && exercise.sets > 0) details.push(`${exercise.sets} sets`);
                if (exercise.reps && exercise.reps > 0) details.push(`${exercise.reps} reps`);
                if (exercise.weight && exercise.weight > 0) details.push(`${exercise.weight} lbs`);
              } else if (exercise.exerciseType === 'cardio') {
                if (exercise.distance && exercise.distance > 0) details.push(`${exercise.distance} mi`);
                if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                if (exercise.speed && exercise.speed > 0) details.push(`${exercise.speed} mph`);
              } else if (exercise.exerciseType === 'mindbody') {
                if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                if (exercise.intensity && exercise.intensity !== 'n/a') details.push(`${exercise.intensity} intensity`);
              }

              return (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: `2px solid ${getTypeColor(exercise.exerciseType)}`,
                    borderRadius: 2,
                    backgroundColor: `${getTypeColor(exercise.exerciseType)}15`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {exercise.name}
                    </Typography>
                    {details.length > 0 && (
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        {details.join(' • ')}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    onClick={() => deleteExercise(index)}
                    size="small"
                    sx={{ color: '#ff6b6b' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleAddWorkout}
          disabled={!workoutName.trim() || currentExercises.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #654392 100%)',
            },
            '&:disabled': {
              background: '#ccc',
            },
          }}
        >
          Create Workout
        </Button>
      </Box>

      {(!workoutName.trim() || currentExercises.length === 0) && (
        <Typography variant="body2" sx={{ color: '#999', mt: 1, textAlign: 'center' }}>
          {workoutName.trim() === '' && currentExercises.length === 0
            ? 'Please name the workout and add at least one exercise'
            : workoutName.trim() === ''
            ? 'Please name the workout'
            : 'Please add at least one exercise'}
        </Typography>
      )}
    </Box>
  );
};

export default WorkoutInput;
