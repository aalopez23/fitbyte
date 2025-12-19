import { getDB } from './createTable';

const checkUser = async () => {
  try {
    const db = await getDB();
    
    // Check all users
    const users = await db.all('SELECT id, username, email, created_at FROM users');
    
    console.log('Users in database:');
    if (users.length === 0) {
      console.log('No users found!');
    } else {
      users.forEach((user: any) => {
        console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
      });
    }
    
    // Check specifically for testuser
    const testUser = await db.get('SELECT * FROM users WHERE username = ?', ['testuser']);
    if (testUser) {
      console.log('\nTest user found:');
      console.log(`Username: ${testUser.username}`);
      console.log(`Email: ${testUser.email}`);
      console.log(`Password hash exists: ${!!testUser.password_hash}`);
      console.log(`Password hash length: ${testUser.password_hash?.length || 0}`);
    } else {
      console.log('\nTest user NOT found!');
    }
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUser();

