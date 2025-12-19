import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoginIcon from '@mui/icons-material/Login';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const { signIn, signUp, loading } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email) {
        setError('Email is required');
        return;
      }
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        history.push('/');
      }
    } else {
      if (!email || !username) {
        setError('Email and username are required');
        return;
      }
      const result = await signUp(email, password, username);
      if (result.error) {
        setError(result.error);
      } else {
        history.push('/');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <LoginIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                {isLogin ? 'Welcome back to FitByte' : 'Create your FitByte account'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="username"
                />
              )}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #654392 100%)',
                  },
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                sx={{ textTransform: 'none' }}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;

