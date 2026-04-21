import mongoose from 'mongoose';

// Manually defining the schema to avoid import issues in a script
const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});

// Use existing model if it exists, otherwise define it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateAdmin() {
    const uri = "mongodb://127.0.0.1:27017/universityDB";
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        
        const result = await User.updateOne(
            { email: 'admin@gmail.com' },
            { $set: { role: 'admin' } }
        );
        
        if (result.matchedCount > 0) {
            console.log('Successfully updated admin@gmail.com to admin role');
        } else {
            console.log('User admin@gmail.com not found');
        }
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await mongoose.disconnect();
    }
}

updateAdmin();
