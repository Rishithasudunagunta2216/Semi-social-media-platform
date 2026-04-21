const mongoose = require('mongoose');

// Hardcoding URIs to ensure no parsing errors during this critical migration
const ATLAS_URI = "mongodb+srv://admin:YdOBGnWtW9X3K1FW@cluster0.avprozm.mongodb.net/universityDB?retryWrites=true&w=majority";
const LOCAL_URI = "mongodb://127.0.0.1:27017/universityDB";

// Define Schemas for migration
const schemas = {
  User: new mongoose.Schema({}, { strict: false, collection: 'users' }),
  Confession: new mongoose.Schema({}, { strict: false, collection: 'confessions' }),
  Question: new mongoose.Schema({}, { strict: false, collection: 'questions' }),
  Setting: new mongoose.Schema({}, { strict: false, collection: 'settings' }),
  Answer: new mongoose.Schema({}, { strict: false, collection: 'answers' }),
  Post: new mongoose.Schema({}, { strict: false, collection: 'posts' })
};

async function migrate() {
  let localConn, atlasConn;
  
  try {
    console.log('--- Database Migration Started ---');
    
    // Connect to Local
    console.log('Connecting to Local MongoDB...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to Local.');

    // Connect to Atlas
    console.log('Connecting to MongoDB Atlas...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas.\n');

    for (const [name, schema] of Object.entries(schemas)) {
      console.log(`Processing collection: ${name}...`);
      
      const LocalModel = localConn.model(name, schema);
      const AtlasModel = atlasConn.model(name, schema);
      
      const data = await LocalModel.find({});
      console.log(`  - Found ${data.length} records in Local.`);
      
      if (data.length > 0) {
        // Clear Atlas collection first to avoid duplicates
        await AtlasModel.deleteMany({});
        console.log(`  - Cleared existing records in Atlas.`);
        
        // Insert data using the raw data objects
        const plainData = data.map(doc => doc.toObject());
        await AtlasModel.insertMany(plainData);
        console.log(`  - Successfully migrated ${data.length} records to Atlas.`);
      } else {
        console.log(`  - Skipping (No data found).`);
      }
    }

    console.log('\n--- Migration Completed Successfully! ---');
    console.log('You can now see your data in MongoDB Compass (Atlas connection).');

  } catch (error) {
    console.error('\n!!! Migration Failed !!!');
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
