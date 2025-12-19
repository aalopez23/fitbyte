import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import initDB from './createTable';

const seedTestUser = async () => {
  let db;
  try {
    // Initialize database first
    await initDB();
    
    // Get a fresh connection for this script
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    });
    
    // Check if test user already exists
    const existingUser = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      ['testuser', 'test@fitbyte.com']
    );

    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Username: testuser');
      console.log('Email: test@fitbyte.com');
      console.log('Password: test123');
      await db.close();
      process.exit(0);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('test123', 10);

    // Insert test user
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      ['testuser', 'test@fitbyte.com', passwordHash]
    );

    console.log('Test user created successfully!');
    console.log(`User ID: ${result.lastID}`);
    console.log('Username: testuser');
    console.log('Email: test@fitbyte.com');
    console.log('Password: test123');
    
    // Verify the user was created
    const verifyUser = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    if (verifyUser) {
      console.log('\nVerification: User found in database');
      console.log(`Password hash length: ${verifyUser.password_hash.length}`);
    }
    
    await db.close();
    process.exit(0);
  } catch (error: any) {
    console.error('Error seeding test user:', error);
    if (db) await db.close();
    process.exit(1);
  }
};

seedTestUser();

