import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createUser, findUserByHealingName, findUserById, findUserByEmail, updateUser } from './googleSheetsService.js';

dotenv.config();

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

  try {
    // Check if user already exists by email
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    // Check if healing name is already taken
    const existingUserByName = await findUserByHealingName(healingName);
    if (existingUserByName) {
      throw new Error('This healing name is already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in Google Sheets
    const newUser = await createUser({
      healingName,
      email,
      passwordHash: hashedPassword,
      role: 'user',
      registrationDate: new Date().toISOString(),
      journeyStatus: 'Active'
    });

    // Return user without password
    return {
      id: newUser.id,
      healingName: newUser.healingName,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.registrationDate || new Date().toISOString()
    };
  } catch (error) {
    console.error('Google Sheets error:', error);
    throw error;
  }
}

/**
 * Login a user
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} User object and tokens
 */
export async function loginUser(email, password) {
  try {
    // Find user by email
    const userRecord = await findUserByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = userRecord.passwordHash;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const userId = userRecord.id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Return user without password and tokens
    const user = {
      id: userRecord.id,
      healingName: userRecord.healingName,
      email: userRecord.email,
      role: userRecord.role || 'user',
      createdAt: userRecord.registrationDate
    };

    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Get user by ID
 *
 * @param {string} userId - User ID
 * @returns {Object} User object without password
 */
export async function getUserById(userId) {
  try {
    // Get user by ID from Google Sheets
    const userRecord = await findUserById(userId);

    if (!userRecord) {
      return null;
    }

    // Return user without password
    return {
      id: userRecord.id,
      healingName: userRecord.healingName,
      email: userRecord.email,
      role: userRecord.role || 'user',
      createdAt: userRecord.registrationDate
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
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
 * @throws {Error} If token is invalid
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    console.error('Access token verification failed:', error.message);
    throw new Error('Invalid token');
  }
}

/**
 * Verify refresh token
 *
 * @param {string} token - Refresh token
 * @returns {Object} Decoded token
 * @throws {Error} If token is invalid
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    throw new Error('Invalid refresh token');
  }
}

/**
 * Refresh access token
 *
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New access token
 * @throws {Error} If refresh token is invalid
 */
export function refreshAccessToken(refreshToken) {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    return { accessToken };
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    throw new Error('Invalid refresh token');
  }
}
