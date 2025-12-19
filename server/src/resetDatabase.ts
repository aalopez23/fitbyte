import * as fs from 'fs';
import * as path from 'path';

const resetDatabase = async () => {
  const dbPath = path.join(__dirname, '../database.sqlite');
  
  try {
    // Delete the database file if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Old database file deleted.');
    } else {
      console.log('No existing database file found.');
    }

    // Now initialize the database with the new schema
    const { default: initDB } = await import('./createTable');
    const db = await initDB();
    console.log('Database initialized with new schema!');
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();

