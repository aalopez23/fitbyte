import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HomePage: React.FC = () => {
  return (
    <Box className="home-page">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Welcome to FitByte
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Your personal fitness companion. Track workouts, set goals, and achieve your best self.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontStyle: 'italic',
              opacity: 0.8,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            "FitByte changed my life"
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Get Started Today
        </Typography>

        <Grid container spacing={4}>
          {/* Workouts Feature */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
                border: '1px solid #e0e0e0',
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Workout Planner
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Create custom workout routines. Track your exercises, sets, reps, and progress all in one place.
                </Typography>
                <Button
                  component={Link}
                  to="/workouts"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: '#667eea',
                    '&:hover': {
                      backgroundColor: '#5568d3',
                    },
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Start Planning
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Goals Feature */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
                border: '1px solid #e0e0e0',
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <TrackChangesIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Goal Tracker
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Set and track your fitness goals. Stay motivated and monitor your progress as you work towards your objectives.
                </Typography>
                <Button
                  component={Link}
                  to="/goals"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e083eb 0%, #e5475c 100%)',
                    },
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Track Goals
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Feature */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
                border: '1px solid #e0e0e0',
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Track Progress
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Monitor your fitness journey over time. See your improvements and stay motivated to reach new heights.
                </Typography>
                <Button
                  component={Link}
                  to="/progress"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: '#4facfe',
                    color: '#4facfe',
                    '&:hover': {
                      borderColor: '#3a9cee',
                      backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    },
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Mission Section */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#555',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.2rem',
            }}
          >
            Let us do the thinking while you do the pushing.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#777',
              mt: 2,
              fontSize: '1rem',
            }}
          >
            No hidden fees. No complicated setup. Just bring your attitude!
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;