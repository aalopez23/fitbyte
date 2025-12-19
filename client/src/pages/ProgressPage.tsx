import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import * as supabaseService from '../services/supabaseService';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

const ProgressPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [nutritionStats, setNutritionStats] = useState<any>(null);
  const [goalStats, setGoalStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workouts, nutrition, goals] = await Promise.all([
          supabaseService.getWorkoutStats(days),
          supabaseService.getNutritionStats(days),
          supabaseService.getGoalStats(),
        ]);

        setWorkoutStats(workouts);
        setNutritionStats(nutrition);
        setGoalStats(goals);
      } catch (error: any) {
        console.error('Error loading stats:', error);
      }
    };
    fetchStats();
  }, [days]);

  const workoutChartData = workoutStats?.recentLogs?.map((log: any) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    workouts: log.count || 0,
  })) || [];

  const nutritionChartData = nutritionStats?.dailyStats?.slice(0, 7).reverse().map((stat: any) => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: Math.round(stat.totalCalories || 0),
    protein: Math.round(stat.totalProtein || 0),
    carbs: Math.round(stat.totalCarbs || 0),
    fats: Math.round(stat.totalFats || 0),
  })) || [];

  const macroData = nutritionStats?.averages
    ? [
        { name: 'Protein', value: Math.round(nutritionStats.averages.protein) },
        { name: 'Carbs', value: Math.round(nutritionStats.averages.carbs) },
        { name: 'Fats', value: Math.round(nutritionStats.averages.fats) },
      ]
    : [];

  const goalData = goalStats
    ? [
        { name: 'Completed', value: goalStats.completed },
        { name: 'In Progress', value: goalStats.total - goalStats.completed },
      ]
    : [];

  return (
    <Box className="progress-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Progress Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
                Track your fitness journey with data visualizations
              </Typography>
            </Box>
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select value={days} onChange={(e) => setDays(e.target.value as number)} label="Time Period">
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {workoutStats?.total || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  Total Workouts Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4facfe' }}>
                  {Math.round(nutritionStats?.averages?.calories || 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  Avg Daily Calories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f093fb' }}>
                  {goalStats ? `${Math.round(goalStats.completionRate)}%` : '0%'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  Goal Completion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Workout Frequency */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Workout Frequency
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="workouts" fill="#667eea" name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Goal Completion */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Goal Progress
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={goalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {goalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Nutrition Trends */}
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Nutrition Trends (Last 7 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={nutritionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calories" stroke="#ff6b6b" name="Calories" />
                    <Line type="monotone" dataKey="protein" stroke="#4ecdc4" name="Protein (g)" />
                    <Line type="monotone" dataKey="carbs" stroke="#ffe66d" name="Carbs (g)" />
                    <Line type="monotone" dataKey="fats" stroke="#95e1d3" name="Fats (g)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Macro Breakdown */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Average Macronutrient Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}g`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Workout Stats */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Weekly Workout Stats
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutStats?.weeklyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#764ba2" name="Workouts per Week" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProgressPage;

