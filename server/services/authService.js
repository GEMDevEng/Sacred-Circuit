import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be stored in a database
// For this example, we'll use an in-memory store
const users = [];

/**
 * Register a new user
 * 
 * @param {Object} userData - User data
 * @param {string} userData.healingName - User's healing name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Object} User object without password
 */
export async function registerUser(userData) {
  const { healingName, email, password } = userData;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = {
    id: uuidv4(),
    healingName,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  // Save user
  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Login a user
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} User object and tokens
 */
export async function loginUser(email, password) {
  // Find user
  const user = users.find(user => user.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Return user without password and tokens
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

/**
 * Get user by ID
 * 
 * @param {string} userId - User ID
 * @returns {Object} User object without password
 */
export function getUserById(userId) {
  const user = users.find(user => user.id === userId);
  if (!user) {
    return null;
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Generate access token
 * 
 * @param {string} userId - User ID
 * @returns {string} Access token
 */
function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );
}

/**
 * Generate refresh token
 * 
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );
}

/**
 * Verify access token
 * 
 * @param {string} token - Access token
 * @returns {Object} Decoded token
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Verify refresh token
 * 
 * @param {string} token - Refresh token
 * @returns {Object} Decoded token
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

/**
 * Refresh access token
 * 
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New access token
 */
export function refreshAccessToken(refreshToken) {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);
    
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
