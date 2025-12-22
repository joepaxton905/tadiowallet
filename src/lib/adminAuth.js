import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const JWT_EXPIRES_IN = '24h'

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tadiowallet.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

/**
 * Verify admin credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {boolean} Whether credentials are valid
 */
export function verifyAdminCredentials(email, password) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

/**
 * Generate JWT token for admin
 * @returns {string} JWT token
 */
export function generateAdminToken() {
  return jwt.sign(
    { 
      role: 'admin',
      email: ADMIN_EMAIL,
      isAdmin: true,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify admin JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Check if token is for admin
    if (decoded.role !== 'admin' || !decoded.isAdmin) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Extract and verify admin token from request headers
 * @param {Request} request - Next.js request object
 * @returns {Object|null} Decoded token or null if invalid
 */
export function getAdminFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  return verifyAdminToken(token)
}

/**
 * Middleware to check if user is admin
 * Returns error response if not authorized
 */
export function requireAdmin(request) {
  const admin = getAdminFromRequest(request)
  
  if (!admin) {
    return {
      authorized: false,
      error: 'Unauthorized: Admin access required',
      status: 401
    }
  }
  
  return {
    authorized: true,
    admin
  }
}

