const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);
async function fix() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/universityDB');
        await User.updateOne(
            { email: 'admin@srmap.edu.in' },
            { $set: { name: 'Admin Name', registrationNumber: 'ADMIN-100' } }
        );
        console.log('Successfully updated admin@srmap.edu.in missing schema fields.');
    } catch(e) { console.error(e); } finally { await mongoose.disconnect(); }
}
fix();
