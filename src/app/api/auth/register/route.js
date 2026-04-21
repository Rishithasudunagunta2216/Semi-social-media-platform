import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { signToken, isValidUniversityEmail } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, registrationNumber, password } = body;

        // Validate required fields
        if (!name || !email || !registrationNumber || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email domain
        if (!isValidUniversityEmail(email)) {
            return NextResponse.json(
                { error: 'Please use your university email address' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { registrationNumber }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or registration number already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            registrationNumber,
            password: hashedPassword,
            role: 'student',
        });

        // Generate token
        const token = signToken({
            userId: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        const response = NextResponse.json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        }, { status: 201 });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('CRITICAL: Registration API Failure');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        
        return NextResponse.json(
            { 
                error: 'Internal server error', 
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined 
            },
            { status: 500 }
        );
    }
}
