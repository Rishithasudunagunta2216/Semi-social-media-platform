const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    name: String,
    registrationNumber: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function fix() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/universityDB');
        await User.updateOne(
            { email: 'admin@gmail.com' },
            { $set: { 
                name: 'System Admin',
                registrationNumber: 'ADMIN-001'
            } }
        );
        console.log('Fixed missing fields on admin account.');
    } catch(e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
fix();
