const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function reset() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/universityDB');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.updateOne(
            { email: 'admin@srmap.edu.in' },
            { $set: { password: hashedPassword, role: 'admin' } }
        );
        console.log('Password for admin@srmap.edu.in reset to admin123');
    } catch(e) { console.error(e); } finally { await mongoose.disconnect(); }
}
reset();
