/**
 * Utility functions for validating input data
 */

/**
 * Validates a healing name
 * 
 * @param {string} healingName - The healing name to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidHealingName(healingName) {
  // Healing name should be at least 2 characters and not more than 50
  return typeof healingName === 'string' && 
    healingName.trim().length >= 2 && 
    healingName.trim().length <= 50;
}

/**
 * Validates an email address
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidEmail(email) {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

/**
 * Validates a chat message
 * 
 * @param {string} message - The message to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidChatMessage(message) {
  // Message should not be empty and not more than 1000 characters
  return typeof message === 'string' && 
    message.trim().length > 0 && 
    message.trim().length <= 1000;
}

/**
 * Validates a reflection submission
 * 
 * @param {string} reflection - The reflection text to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidReflection(reflection) {
  // Reflection should not be empty and not more than 5000 characters
  return typeof reflection === 'string' && 
    reflection.trim().length > 0 && 
    reflection.trim().length <= 5000;
}

/**
 * Validates a milestone value
 * 
 * @param {string} milestone - The milestone to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidMilestone(milestone) {
  // Valid milestones are Day 1, Day 7, Day 14, etc.
  const validMilestones = ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30', 'Day 60', 'Day 90'];
  return validMilestones.includes(milestone);
}

/**
 * Validates an object has all required fields
 * 
 * @param {Object} obj - The object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {boolean} True if all required fields exist and are not empty, false otherwise
 */
export function hasRequiredFields(obj, requiredFields) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    const value = obj[field];
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  });
}

/**
 * Validates a request body against a schema
 * 
 * @param {Object} body - The request body to validate
 * @param {Object} schema - The schema to validate against
 * @returns {Object} Validation result with isValid and errors properties
 */
export function validateSchema(body, schema) {
  const errors = [];
  
  // Check required fields
  if (schema.required && Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`${field} is required`);
      }
    }
  }
  
  // Check field types and constraints
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [field, rules] of Object.entries(schema.properties)) {
      if (body[field] !== undefined && body[field] !== null) {
        // Check type
        if (rules.type && typeof body[field] !== rules.type) {
          errors.push(`${field} must be a ${rules.type}`);
        }
        
        // Check string constraints
        if (rules.type === 'string') {
          if (rules.minLength && body[field].length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && body[field].length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`);
          }
          if (rules.pattern && !new RegExp(rules.pattern).test(body[field])) {
            errors.push(`${field} has an invalid format`);
          }
        }
        
        // Check number constraints
        if (rules.type === 'number') {
          if (rules.minimum !== undefined && body[field] < rules.minimum) {
            errors.push(`${field} must be at least ${rules.minimum}`);
          }
          if (rules.maximum !== undefined && body[field] > rules.maximum) {
            errors.push(`${field} must be at most ${rules.maximum}`);
          }
        }
        
        // Check enum constraints
        if (rules.enum && !rules.enum.includes(body[field])) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
