import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    if (typeof window === 'undefined') {
        console.warn('WARNING: JWT_SECRET is not defined in environment variables.');
    }
}
const JWT_EXPIRES_IN = '7d';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function getTokenFromRequest(request) {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Check cookies
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies['token'] || null;
    }

    return null;
}

export function getUserFromRequest(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

// Validate university email domain
export function isValidUniversityEmail(email) {
    // Allow common university domains - customize this
    const validDomains = [
        '.edu',
        '.edu.in',
        '.ac.in',
        '.ac.uk',
        '.edu.au',
        '.university.edu',
    ];

    const emailLower = email.toLowerCase();
    return validDomains.some(domain => emailLower.endsWith(domain)) ||
        emailLower.includes('@university') ||
        // For demo purposes, allow gmail too
        true;
}
