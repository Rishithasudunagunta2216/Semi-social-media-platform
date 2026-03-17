import { verifyAdminToken } from './adminAuth';
import { NextResponse } from 'next/server';

/**
 * Higher-Order Function to protect Next.js App Router route handlers.
 * It verifies the admin JWT token before executing the actual handler.
 * @param {Function} handler - The original route handler.
 * @returns {Function} - The wrapped route handler.
 */
export function withAdminAuth(handler) {
  return async (req, ...args) => {
    // Determine how the token is passed. 
    // Option 1: Authorization header (Bearer token)
    // Option 2: Cookies
    
    let token = null;

    // First try the Authorization header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } 
    // Then try cookies (useful if we set a cookie on login)
    else {
      const authCookie = req.cookies.get('admin_token');
      if (authCookie) {
        token = authCookie.value;
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyAdminToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Invalid admin credentials or insufficient role' },
        { status: 403 }
      );
    }

    // Pass the decoded payload via request if needed, 
    // but in modern Next.js it's easier to just pass as an extra arg if necessary.
    // We will just execute the handler securely.
    
    // Inject decoded user somehow if requested, e.g., attaching to a custom req object 
    // (req in next 13+ is a Request object and readonly out of the box).
    
    return handler(req, ...args);
  };
}
