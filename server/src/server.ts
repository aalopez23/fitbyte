import express from 'express';
import cors from 'cors';
import initDB from './createTable';
import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import goalRoutes from './routes/goals';
import nutritionRoutes from './routes/nutrition';
import statsRoutes from './routes/stats';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB().then(() => {
  console.log('Database initialized');
}).catch((err) => {
  console.error('Database initialization error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitByte API is running' });
});

// Catch-all for undefined routes (for debugging)
app.use('/api/*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

