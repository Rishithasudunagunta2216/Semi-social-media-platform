import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Setting from '@/lib/models/Setting';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// POST - Seed admin user and default settings
export async function POST() {
    try {
        await dbConnect();

        // Check if admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists', email: existingAdmin.email });
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@university.edu',
            registrationNumber: 'ADMIN001',
            password: hashedPassword,
            role: 'admin',
        });

        // Create default settings
        await Setting.findOneAndUpdate(
            { key: 'confessionMode' },
            { value: false },
            { upsert: true }
        );

        return NextResponse.json({
            message: 'Admin seeded successfully',
            credentials: {
                email: 'admin@university.edu',
                password: 'admin123',
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500 });
    }
}
