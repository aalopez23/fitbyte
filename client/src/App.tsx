// src/App.tsx
import React from 'react';
import './index.css';
import WorkoutsPage from './pages/WorkoutsPage';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom';
import GoalTrackerPage from './pages/GoalTrackerPage';
import LoginPage from './pages/LoginPage';
import NutritionPage from './pages/NutritionPage';
import ProgressPage from './pages/ProgressPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navigation: React.FC = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await signOut();
    history.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 4, gap: 4 }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'white', 
            fontWeight: 700,
            minWidth: 'fit-content'
          }}
        >
          FitByte
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          alignItems: 'center', 
          flex: 1, 
          justifyContent: 'center',
          mx: 'auto'
        }}>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none', fontWeight: 500, px: 2 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/workouts" sx={{ textTransform: 'none', fontWeight: 500, px: 2 }}>
            Workouts
          </Button>
          <Button color="inherit" component={Link} to="/nutrition" sx={{ textTransform: 'none', fontWeight: 500, px: 2 }}>
            Nutrition
          </Button>
          <Button color="inherit" component={Link} to="/goals" sx={{ textTransform: 'none', fontWeight: 500, px: 2 }}>
            Goals
          </Button>
          <Button color="inherit" component={Link} to="/progress" sx={{ textTransform: 'none', fontWeight: 500, px: 2 }}>
            Progress
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', minWidth: 'fit-content' }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {user?.email?.split('@')[0] || user?.id}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography>Loading...</Typography>
    </Box>;
  }

  return (
    <>
      <Navigation />
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        {!isAuthenticated && <Route path="*" component={LoginPage} />}
        {isAuthenticated && (
          <>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/workouts" component={WorkoutsPage} />
            <Route exact path="/nutrition" component={NutritionPage} />
            <Route exact path="/goals" component={GoalTrackerPage} />
            <Route exact path="/progress" component={ProgressPage} />
          </>
        )}
      </Switch>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/fitbyte">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
