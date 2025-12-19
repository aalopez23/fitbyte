# FitByte - Full-Stack Fitness Tracking Application

A full-stack application allowing users to log workouts, track nutrition, and monitor progress with data visualizations. Features authentication and persistent storage.

## Features

- **User Authentication**: JWT-based authentication with secure user registration and login
- **Workout Tracking**: Create, manage, and log custom workout routines with exercises
- **Nutrition Tracking**: Log meals and track daily macronutrients (calories, protein, carbs, fats)
- **Goal Setting**: Set and track fitness goals with completion status
- **Data Visualizations**: Interactive charts and graphs showing:
  - Workout frequency over time
  - Nutrition trends (calories and macros)
  - Goal completion statistics
  - Weekly workout statistics
- **Persistent Storage**: SQLite database with user-specific data isolation

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Recharts for data visualizations
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- TypeScript
- SQLite database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database (creates tables):
```bash
npm run create-tables
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:3001):
```
REACT_APP_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Workouts
- `GET /api/workouts` - Get all workouts for authenticated user
- `POST /api/workouts` - Create a new workout
- `DELETE /api/workouts/:id` - Delete a workout
- `POST /api/workouts/:id/log` - Log workout completion

### Goals
- `GET /api/goals` - Get all goals for authenticated user
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Nutrition
- `GET /api/nutrition` - Get nutrition entries (optional query params: date, startDate, endDate)
- `GET /api/nutrition/summary` - Get nutrition summary for date range
- `POST /api/nutrition` - Create a nutrition entry
- `PUT /api/nutrition/:id` - Update a nutrition entry
- `DELETE /api/nutrition/:id` - Delete a nutrition entry

### Statistics
- `GET /api/stats/workouts?days=30` - Get workout statistics
- `GET /api/stats/nutrition?days=30` - Get nutrition statistics
- `GET /api/stats/goals` - Get goal completion statistics

## Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts
- `workouts` - Workout plans
- `exercises` - Exercises within workouts
- `workout_logs` - Logged workout completions
- `goals` - User goals
- `nutrition` - Nutrition entries

## Deployment

For production deployment:
1. Set environment variables (JWT_SECRET, PORT, etc.)
2. Build the frontend: `cd client && npm run build`
3. Serve the built files and run the backend server
4. Configure CORS appropriately for your domain

## Future Enhancements

- AWS EC2 deployment with CI/CD pipelines
- Additional workout analytics
- Social features and sharing
- Mobile app version
- Integration with fitness wearables
