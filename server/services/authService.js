import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const usersTable = base('Users');

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
    const existingUserByEmail = await usersTable.select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).firstPage();

    if (existingUserByEmail && existingUserByEmail.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Check if healing name is already taken
    const existingUserByName = await usersTable.select({
      filterByFormula: `{Healing Name} = '${healingName}'`,
      maxRecords: 1
    }).firstPage();

    if (existingUserByName && existingUserByName.length > 0) {
      throw new Error('This healing name is already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in Airtable
    const newUserRecord = await usersTable.create({
      'Healing Name': healingName,
      'Email': email,
      'Password': hashedPassword, // Store hashed password
      'Role': 'user',
      'Registration Date': new Date().toISOString(),
      'Journey Status': 'Active'
    });

    // Return user without password
    return {
      id: newUserRecord.id,
      healingName: newUserRecord.fields['Healing Name'],
      email: newUserRecord.fields['Email'],
      role: newUserRecord.fields['Role'],
      createdAt: newUserRecord.fields['Registration Date']
    };
  } catch (error) {
    console.error('Airtable error:', error);
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
    const records = await usersTable.select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).firstPage();

    if (!records || records.length === 0) {
      throw new Error('Invalid credentials');
    }

    const userRecord = records[0];
    const hashedPassword = userRecord.fields['Password'];

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
      healingName: userRecord.fields['Healing Name'],
      email: userRecord.fields['Email'],
      role: userRecord.fields['Role'] || 'user',
      createdAt: userRecord.fields['Registration Date']
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
    // Get user by ID
    const userRecord = await usersTable.find(userId);

    if (!userRecord) {
      return null;
    }

    // Return user without password
    return {
      id: userRecord.id,
      healingName: userRecord.fields['Healing Name'],
      email: userRecord.fields['Email'],
      role: userRecord.fields['Role'] || 'user',
      createdAt: userRecord.fields['Registration Date']
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
