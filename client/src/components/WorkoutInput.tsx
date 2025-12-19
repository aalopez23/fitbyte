import React, { ChangeEvent } from 'react';
import { Exercise } from '../types/types'

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
  addWorkout: () => void;
  deleteWorkout: (index: number) => void;
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
}) => {
  const handleWorkoutNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkoutName(e.target.value);
  };

  const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExerciseName(e.target.value);
  };


  const handleRepsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReps(Number(e.target.value));
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value));
  };

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value));
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(Number(e.target.value));
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div>
      <h2>Workout Name:</h2>
      <input
        type="text"
        value={workoutName}
        onChange={handleWorkoutNameChange}
        placeholder="Workout Name"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
      />
      <h3>Add Exercises</h3>
      <label htmlFor="selectType">Select Category</label>
      <select id="selectType" aria-label="category" onChange={(e) => setExerciseType(e.target.value)} 
              style={{display: 'block', width: '70%', padding: '8px', marginBottom: '10px'}}>
        <option value="strength">Strength Training</option>
        <option value="cardio">Cardio</option>
        <option value="mindbody">Mind/Body</option>
      </select>

      <input
        type="text"
        value={exerciseName}
        onChange={handleExerciseNameChange}
        placeholder="Exercise Name"
        style={{ width: '70%', padding: '8px', marginBottom: '10px'}}
      />

      {exerciseType === "strength" && (
      <>

      <input
        type="number"
        value={sets === 0 ? "" : sets} // if 0 show nothing
        onChange={(e) => setSets(e.target.value === "" ? 0 : Number(e.target.value))} // empty to 0
        placeholder="Sets"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
      />
          
      <input
        type="number"
        value={reps === 0 ? "" : reps} // if 0 show nothing
        onChange={handleRepsChange}
        placeholder="Reps"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />

      <input
        type="number"
        value={weight === 0 ? "" : weight} // if 0 show nothing
        onChange={handleWeightChange}
        placeholder="Weight (lbs)"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />
      
      </>
      )}

      {exerciseType === "cardio" && (
      <>
      <input
        type="number"
        value={distance === 0 ? "" : distance}
        onChange={handleDistanceChange}
        placeholder="Distance (miles)"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />
      
      <input
        type="number"
        value={duration === 0 ? "": duration}
        onChange={handleDurationChange}
        placeholder="Duration (minutes)"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />
       
      <input
        type="number"
        value={speed === 0 ? "" : speed}
        onChange={handleSpeedChange}
        placeholder="Speed (mph)"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />

      </>
      )}

      {exerciseType === "mindbody" && (
      <>
      <input
        type="number"
        value={duration === 0 ? "" : duration}
        onChange={handleDurationChange}
        placeholder="Duration (minutes)"
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
        min="0"
      />


      <select
        id="intensity" aria-label="Intensity (Optional)" onChange={(e) => setIntensity(e.target.value)}
        style={{ width: '70%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="n/a">Intensity (Optional)</option>
        <option value="Light">Light</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High</option>
      </select>
      <br></br>
      </>
      )}

      <button onClick={addExercise} style={{ padding: '8px 16px', marginLeft: '0px' }}>
        Add Exercise
      </button>

      <ul>
        {currentExercises.map((exercise, index) => (
          <li key={index}>

            {exercise.name}
            <br/>

            {(() => {
              if (exercise.exerciseType === "strength") {
                const details = [];
                if (exercise.sets && exercise.sets > 0) details.push(`${exercise.sets} sets`);
                if (exercise.reps && exercise.reps > 0) details.push(`${exercise.reps} reps`);
                if (exercise.weight && exercise.weight > 0) details.push(`${exercise.weight} lbs`);
                return details.length > 0 ? details.join(', ') : null; // Only render if there are valid details
              } else if (exercise.exerciseType === 'cardio') {
                const details = [];
                if (exercise.distance && exercise.distance > 0) details.push(`${exercise.distance} mi`);
                if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                if (exercise.speed && exercise.speed > 0) details.push(`${exercise.speed} mph`);
                return details.length > 0 ? details.join(', ') : null; // Only render if there are valid details      
              } else if (exercise.exerciseType === 'mindbody') {
                const details = [];
                if (exercise.duration && exercise.duration > 0) details.push(`${exercise.duration} min`);
                if (exercise.intensity && exercise.intensity !== 'n/a') details.push(`${exercise.intensity} intensity`);
                return details.length > 0 ? details.join(', ') : null; // Only render if there are valid details
              }
            })()}

            <button onClick={() => deleteExercise(index)} style={{padding: '1px 7px', marginLeft: '10px'}}>
               Delete
            </button>
          </li>
        ))}
      </ul>
      <div>
        {(!workoutName.trim() || currentExercises.length === 0) && (
          <p style={{ color: 'gray' }}>
            {workoutName.trim() === '' && currentExercises.length === 0
              ? 'Please name the workout and add at least one exercise to enable the "Add Workout" button.'
              : workoutName.trim() === ''
              ? 'Please name the workout to enable the "Add Workout" button.'
              : 'Please add at least one exercise to enable the "Add Workout" button.'}
          </p>
        )}
        {workoutName.trim() !== '' && currentExercises.length > 0 && (
          <button
            onClick={() => addWorkout()}
            style={{ padding: '8px 16px', marginLeft: '0px' }}
          >
            Add Workout
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutInput;