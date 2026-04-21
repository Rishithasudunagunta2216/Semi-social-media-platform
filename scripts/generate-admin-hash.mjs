import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Admin Password Hash Generator ---');

rl.question('Enter the admin password to hash: ', async (password) => {
  if (!password) {
    console.error('Password cannot be empty.');
    rl.close();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('\n--- Generated Hash ---');
    console.log(hash);
    console.log('----------------------\n');
    console.log('Add the following to your .env.local:');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
    
  } catch (error) {
    console.error('Error generating hash:', error);
  } finally {
    rl.close();
  }
});
