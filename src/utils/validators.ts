/**
 * Validates a healing name
 * 
 * @param healingName - The healing name to validate
 * @returns True if valid, false otherwise
 */
export function isValidHealingName(healingName: string): boolean {
  // Healing name should be at least 2 characters and not more than 50
  return typeof healingName === 'string' && 
    healingName.trim().length >= 2 && 
    healingName.trim().length <= 50;
}

/**
 * Validates an email address
 * 
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

/**
 * Validates a chat message
 * 
 * @param message - The message to validate
 * @returns True if valid, false otherwise
 */
export function isValidChatMessage(message: string): boolean {
  // Message should not be empty and not more than 1000 characters
  return typeof message === 'string' && 
    message.trim().length > 0 && 
    message.trim().length <= 1000;
}

/**
 * Validates a reflection submission
 * 
 * @param reflection - The reflection text to validate
 * @returns True if valid, false otherwise
 */
export function isValidReflection(reflection: string): boolean {
  // Reflection should not be empty and not more than 5000 characters
  return typeof reflection === 'string' && 
    reflection.trim().length > 0 && 
    reflection.trim().length <= 5000;
}

/**
 * Validates a milestone value
 * 
 * @param milestone - The milestone to validate
 * @returns True if valid, false otherwise
 */
export function isValidMilestone(milestone: string): boolean {
  // Valid milestones are Day 1, Day 7, Day 14, etc.
  const validMilestones = ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30', 'Day 60', 'Day 90'];
  return validMilestones.includes(milestone);
}

/**
 * Validates an object has all required fields
 * 
 * @param obj - The object to validate
 * @param requiredFields - Array of required field names
 * @returns True if all required fields exist and are not empty, false otherwise
 */
export function hasRequiredFields(obj: Record<string, unknown>, requiredFields: string[]): boolean {
  return requiredFields.every(field => {
    const value = obj[field];
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  });
}
