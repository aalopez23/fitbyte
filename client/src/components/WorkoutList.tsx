import React from 'react';
import { Workout } from '../types/types';
import { Box, Typography, Card, CardContent, IconButton, Chip, Grid, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as supabaseService from '../services/supabaseService';

interface WorkoutListProps {
  workouts: Workout[];
  deleteWorkout: (index: number) => void;
  addWorkout: (newWorkout: Workout) => void;
}

const suggestedWorkouts: Workout[] = [
  {
    name: "Full Body Blast",
    exercises: [
      { name: "Push-Up", exerciseType: "strength", sets: 3, reps: 15, weight: 0 },
      { name: "Squats", exerciseType: "strength", sets: 3, reps: 12, weight: 0 },
      { name: "Burpees", exerciseType: "cardio", duration: 5, distance: 0, speed: 0 },
    ],
  },
  {
    name: "Cardio Burner",
    exercises: [
      { name: "Running", exerciseType: "cardio", duration: 20, distance: 2, speed: 6 },
      { name: "Jump Rope", exerciseType: "cardio", duration: 10, distance: 0, speed: 0 },
    ],
  },
  {
    name: "Upper Body Strength",
    exercises: [
      { name: "Bench Press", exerciseType: "strength", sets: 4, reps: 10, weight: 135 },
      { name: "Pull-Ups", exerciseType: "strength", sets: 3, reps: 8, weight: 0 },
      { name: "Shoulder Press", exerciseType: "strength", sets: 3, reps: 12, weight: 45 },
    ],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'strength':
      return <FitnessCenterIcon sx={{ fontSize: 20 }} />;
    case 'cardio':
      return <DirectionsRunIcon sx={{ fontSize: 20 }} />;
    case 'mindbody':
      return <SelfImprovementIcon sx={{ fontSize: 20 }} />;
    default:
      return null;
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

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, deleteWorkout, addWorkout }) => (
  <Box>
    {workouts.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" sx={{ color: '#888', mb: 4, fontWeight: 400 }}>
          No workouts created yet. Click "Create Workout" or choose a suggested workout below to get started!
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {suggestedWorkouts.map((workout, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  border: '1px solid #e0e0e0',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {workout.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {workout.exercises.map((exercise, idx) => (
                      <Chip
                        key={idx}
                        label={exercise.name}
                        size="small"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          backgroundColor: getTypeColor(exercise.exerciseType),
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => addWorkout(workout)}
                    sx={{
                      mt: 'auto',
                      backgroundColor: '#667eea',
                      '&:hover': {
                        backgroundColor: '#5568d3',
                      },
                      textTransform: 'none',
                    }}
                  >
                    Add Workout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    ) : (
      <Grid container spacing={3}>
        {workouts.map((workout, index) => (
          <Grid item xs={12} key={index}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                border: '1px solid #e0e0e0',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
                    {workout.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={async () => {
                        if ((workout as any).id) {
                          try {
                            await supabaseService.logWorkout((workout as any).id);
                            alert('Workout logged successfully!');
                          } catch (error: any) {
                            console.error('Error logging workout:', error);
                            alert('Failed to log workout');
                          }
                        }
                      }}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        '&:hover': {
                          borderColor: '#388e3c',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        },
                      }}
                    >
                      Log Workout
                    </Button>
                    <IconButton
                      onClick={() => deleteWorkout(index)}
                      sx={{
                        color: '#ff6b6b',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        },
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Grouped Exercises */}
                {['strength', 'cardio', 'mindbody'].map((type) => {
                  const filteredExercises = workout?.exercises?.filter(
                    (exercise) => exercise.exerciseType === type
                  ) || [];
                  if (filteredExercises.length === 0) return null;

                  const typeLabels: { [key: string]: string } = {
                    strength: 'Strength Training',
                    cardio: 'Cardio',
                    mindbody: 'Mind/Body',
                  };

                  return (
                    <Box key={type} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        {getTypeIcon(type)}
                        <Typography
                          variant="h6"
                          sx={{
                            ml: 1,
                            fontWeight: 600,
                            color: getTypeColor(type),
                            fontSize: '1.1rem',
                          }}
                        >
                          {typeLabels[type]}
                        </Typography>
                      </Box>
                      <Box sx={{ pl: 4 }}>
                        {filteredExercises.map((exercise, idx) => {
                          let details: string[] = [];
                          if (type === 'strength') {
                            if (exercise.sets && exercise.sets > 0) details.push(`${exercise.sets} sets`);
                            if (exercise.reps && exercise.reps > 0) details.push(`${exercise.reps} reps`);
                            if (exercise.weight && exercise.weight > 0) details.push(`${exercise.weight} lbs`);
                          } else if (type === 'cardio') {
                            if (exercise.distance && exercise.distance > 0) details.push(`${exercise.distance} mi`);
                            if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                            if (exercise.speed && exercise.speed > 0) details.push(`${exercise.speed} mph`);
                          } else if (type === 'mindbody') {
                            if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                            if (exercise.intensity && exercise.intensity !== 'n/a') details.push(`${exercise.intensity} intensity`);
                          }

                          return (
                            <Box
                              key={idx}
                              sx={{
                                mb: 1.5,
                                p: 1.5,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 2,
                                borderLeft: `3px solid ${getTypeColor(type)}`,
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {exercise.name}
                              </Typography>
                              {details.length > 0 && (
                                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
                                  {details.join(' • ')}
                                </Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default WorkoutList;