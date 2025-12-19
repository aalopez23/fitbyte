import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../createTable';
import { JWT_SECRET } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  console.log('Register endpoint hit:', req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const db = await getDB();
    
    // Check if user exists
    const existingUser = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    if (!result.lastID) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: result.lastID, username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.lastID, username, email }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  console.log('Login endpoint hit:', req.method, req.path, req.body);
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username: username ? 'provided' : 'missing', password: password ? 'provided' : 'missing' });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = await getDB();
    
    // Find user - search by username or email
    const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    
    console.log('User lookup result:', user ? { id: user.id, username: user.username, email: user.email, hasPasswordHash: !!user.password_hash } : 'No user found');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password check result:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

