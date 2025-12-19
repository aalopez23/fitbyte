// src/App.tsx
import React, { useState } from 'react';
import '../index.css';
import WorkoutList from '../components/WorkoutList';
import { useWorkouts } from '../hooks/useWorkouts';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import WorkoutInput from '../components/WorkoutInput';
import { Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const WorkoutsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    workoutName,
    setWorkoutName,
    exerciseName,
    setExerciseName,
    exerciseType,
    setExerciseType,
    sets,
    setSets,
    weight,
    setWeight,
    reps,
    setReps,
    speed,
    setSpeed,
    distance,
    setDistance,
    duration,
    setDuration,
    intensity,
    setIntensity,
    currentExercises,
    addExercise,
    deleteExercise,
    workouts,
    addWorkout,
    deleteWorkout,
  } = useWorkouts();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="workouts-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Workout Planner
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleOpenModal}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5568d3',
              },
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            }}
          >
            Create Workout
          </Button>
        </Box>
  
        {/* Main Content */}
        <WorkoutList workouts={workouts} deleteWorkout={deleteWorkout} addWorkout={addWorkout} />

        {/* Modal for Creating Workouts */}
        <Modal 
          open={isModalOpen} 
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box className="modal-box" sx={{ 
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            <WorkoutInput
              workoutName={workoutName}
              setWorkoutName={setWorkoutName}
              exerciseName={exerciseName}
              setExerciseName={setExerciseName}
              exerciseType={exerciseType}
              setExerciseType={setExerciseType}
              sets={sets}
              setSets={setSets}
              reps={reps}
              setReps={setReps}
              weight={weight}
              setWeight={setWeight}
              distance={distance}
              setDistance={setDistance}
              duration={duration}
              setDuration={setDuration}
              speed={speed}
              setSpeed={setSpeed}
              intensity={intensity}
              setIntensity={setIntensity}
              addExercise={addExercise}
              deleteExercise={deleteExercise}
              currentExercises={currentExercises}
              addWorkout={addWorkout}
              deleteWorkout={deleteWorkout}
            />
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default WorkoutsPage;
