import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Generate JWT token for user
 * @param {Object} user - User object with _id
 * @returns {string} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Generate random token for email verification or password reset
 * @returns {string} Random hex token
 */
export function generateRandomToken() {
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a token for storage
 * @param {string} token - Plain token
 * @returns {string} Hashed token
 */
export function hashToken(token) {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePassword(password) {
  const errors = []
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  }
}

/**
 * Calculate password strength score
 * @param {string} password - Password to check
 * @returns {number} Strength score (0-4)
 */
function calculatePasswordStrength(password) {
  if (!password) return 0
  
  let score = 0
  if (password.length >= 8) score++
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++
  if (password.match(/\d/)) score++
  if (password.match(/[^a-zA-Z\d]/)) score++
  
  return score
}

/**
 * Sanitize user object for response (remove sensitive fields)
 * @param {Object} user - User document
 * @returns {Object} Sanitized user object
 */
export function sanitizeUser(user) {
  const userObj = user.toObject ? user.toObject() : { ...user }
  
  delete userObj.password
  delete userObj.twoFactorSecret
  delete userObj.emailVerificationToken
  delete userObj.passwordResetToken
  delete userObj.__v
  
  return userObj
}

/**
 * Create authentication response with user and token
 * @param {Object} user - User document
 * @returns {Object} Response object with user and token
 */
export function createAuthResponse(user) {
  return {
    user: sanitizeUser(user),
    token: generateToken(user),
    expiresIn: JWT_EXPIRES_IN,
  }
}

