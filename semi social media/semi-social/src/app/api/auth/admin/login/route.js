import { NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/adminAuth';

// Simple in-memory rate limiting (Note: resets on server restart)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check rate limit
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const attempts = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };

    if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
      console.warn(`Admin login blocked for IP: ${clientIp} due to too many attempts.`);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    // Check if it's an admin login attempt
    if (email !== adminEmail) {
      // Logic for regular user login could go here or in a separate route.
      // For this specific admin login route, if it's not the admin email, we deny.
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const isValid = await validateAdminPassword(password);

    if (!isValid) {
      // Update rate limit on failure
      attempts.count += 1;
      attempts.lastAttempt = Date.now();
      loginAttempts.set(clientIp, attempts);

      console.warn(`Failed admin login attempt for email: ${email} from IP: ${clientIp}`);
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Success: Reset rate limit
    loginAttempts.delete(clientIp);

    const token = generateAdminToken();

    console.log(`Successful admin login for: ${email}`);

    const response = NextResponse.json(
      { message: 'Admin login successful', token },
      { status: 200 }
    );

    // Optional: Set a secure HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
