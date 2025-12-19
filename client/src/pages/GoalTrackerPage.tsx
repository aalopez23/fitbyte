// src/pages/GoalTrackerPage.tsx
import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Checkbox, IconButton, Grid } from '@mui/material';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const GoalTrackerPage: React.FC = () => {
  const { goals, addGoal, deleteGoal, completeGoal } = useGoals();
  const [goalTitle, setGoalTitle] = useState('');

  const handleAddGoal = () => {
    if (goalTitle.trim()) {
      const newGoal: Goal = {
        id: new Date().toISOString(),
        title: goalTitle.trim(),
        isCompleted: false,
      };
      addGoal(newGoal);
      setGoalTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };

  return (
    <Box className="goals-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: 4,
          gap: 2
        }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrackChangesIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Goal Tracker
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
              Set, track, and achieve your personal fitness goals!
            </Typography>
          </Box>
        </Box>

        {/* Add Goal Section */}
        <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Add New Goal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your goal..."
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ 
                  flexGrow: 1,
                  minWidth: { xs: '100%', sm: '300px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddGoal}
                startIcon={<AddIcon />}
                disabled={!goalTitle.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e083eb 0%, #e5475c 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Add Goal
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <TrackChangesIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#888', mb: 1 }}>
                No goals yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                Add your first goal above to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {goals.map((goal) => (
              <Grid item xs={12} key={goal.id}>
                <Card
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    border: '1px solid #e0e0e0',
                    opacity: goal.isCompleted ? 0.7 : 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Checkbox
                        checked={goal.isCompleted}
                        onChange={() => completeGoal(goal.id)}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          flexGrow: 1,
                          textDecoration: goal.isCompleted ? 'line-through' : 'none',
                          color: goal.isCompleted ? '#999' : '#333',
                          fontWeight: goal.isCompleted ? 400 : 500,
                        }}
                      >
                        {goal.title}
                      </Typography>
                      <IconButton
                        onClick={() => deleteGoal(goal.id)}
                        sx={{
                          color: '#ff6b6b',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default GoalTrackerPage;