import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null;

const initDB = async (): Promise<Database> => {
  if (db) return db;

  // Open the database connection
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.exec("PRAGMA foreign_keys = ON");

  // Create tables one by one for better error handling
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    sets INTEGER DEFAULT 0,
    rep_count INTEGER DEFAULT 0,
    weight_count INTEGER DEFAULT 0,
    distance_miles FLOAT DEFAULT 0,
    duration_min FLOAT DEFAULT 0,
    speed_mph FLOAT DEFAULT 0,
    intensity_level TEXT DEFAULT 'n/a',
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    goal_name TEXT NOT NULL,
    isCompleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein FLOAT DEFAULT 0,
    carbs FLOAT DEFAULT 0,
    fats FLOAT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Create indexes
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_id_workouts ON workouts(user_id)`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_id_goals ON goals(user_id)`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_id_nutrition ON nutrition(user_id)`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_nutrition_date ON nutrition(date)`
  );

  return db;
};

export const getDB = async (): Promise<Database> => {
  if (!db) {
    return await initDB();
  }
  return db;
};

export default initDB;
