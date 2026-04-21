const mongoose = require('mongoose');

// Hardcoding URI for quick check as dotenv is not installed as a dependency
const MONGODB_URI = "mongodb+srv://admin:YdOBGnWtW9X3K1FW@cluster0.avprozm.mongodb.net/universityDB?retryWrites=true&w=majority";

// Minimal schema definitions to check counts
const schemas = {
  User: new mongoose.Schema({}, { strict: false, collection: 'users' }),
  Confession: new mongoose.Schema({}, { strict: false, collection: 'confessions' }),
  Question: new mongoose.Schema({}, { strict: false, collection: 'questions' }),
  Setting: new mongoose.Schema({}, { strict: false, collection: 'settings' }),
  Answer: new mongoose.Schema({}, { strict: false, collection: 'answers' }),
  Post: new mongoose.Schema({}, { strict: false, collection: 'posts' })
};

async function checkData() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');

    const results = {};
    for (const [name, schema] of Object.entries(schemas)) {
      const Model = mongoose.models[name] || mongoose.model(name, schema);
      const count = await Model.countDocuments();
      results[name] = count;
    }

    console.log('--- Collection Counts in Atlas ---');
    console.table(results);
    
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    if (total === 0) {
      console.log('\nResult: The Atlas cluster is currently EMPTY.');
    } else {
      console.log(`\nResult: Found ${total} total documents across collections.`);
    }

  } catch (error) {
    console.error('Error checking Atlas data:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();
