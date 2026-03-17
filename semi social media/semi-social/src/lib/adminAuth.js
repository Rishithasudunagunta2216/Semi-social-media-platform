import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Validates the admin password against the stored hash.
 * @param {string} password - The plain text password from the request.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
export async function validateAdminPassword(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('ADMIN_PASSWORD_HASH is not set in environment variables');
    return false;
  }
  return bcrypt.compare(password, hash);
}

/**
 * Generates a JWT token for the admin.
 * @returns {string} - The generated JWT token.
 */
export function generateAdminToken() {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  // Token includes userId and role
  return jwt.sign(
    {
      userId: 'admin',
      role: 'admin',
    },
    secret,
    { expiresIn: '1d' } // Expires in 1 day
  );
}

/**
 * Verifies the admin JWT token.
 * @param {string} token - The token to verify.
 * @returns {object|null} - The decoded payload if valid, null otherwise.
 */
export function verifyAdminToken(token) {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  
  if (!secret) {
    console.error('JWT_SECRET is not set in environment variables');
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret);
    // Extra guard: check if the role is truly admin
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  } catch (error) {
    return null; // Invalid or expired token
  }
}
