const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function reset() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/universityDB');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.updateOne(
            { email: 'admin@gmail.com' },
            { $set: { password: hashedPassword, role: 'admin' } },
            { upsert: true }
        );
        console.log('Admin password reset successful. Password is now: admin123');
    } catch(e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
reset();
