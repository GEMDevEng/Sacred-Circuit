/**
 * Validation functions for form inputs
 * These functions return undefined if valid, or an error message if invalid
 */

/**
 * Validates a required field
 *
 * @param value - The value to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateRequired(value: any): string | undefined {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return undefined;
}

/**
 * Validates a minimum length
 *
 * @param minLength - The minimum length required
 * @returns Validation function
 */
export function validateMinLength(minLength: number) {
  return (value: string): string | undefined => {
    if (typeof value === 'string' && value.trim().length < minLength) {
      return `Must be at least ${minLength} characters`;
    }
    return undefined;
  };
}

/**
 * Validates a maximum length
 *
 * @param maxLength - The maximum length allowed
 * @returns Validation function
 */
export function validateMaxLength(maxLength: number) {
  return (value: string): string | undefined => {
    if (typeof value === 'string' && value.trim().length > maxLength) {
      return `Must be no more than ${maxLength} characters`;
    }
    return undefined;
  };
}

/**
 * Validates an email address
 *
 * @param email - The email to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validates a password
 *
 * @param password - The password to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePassword(password: string): string | undefined {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return undefined;
}

/**
 * Validates that two fields match
 *
 * @param matchField - The field to match against
 * @param matchFieldName - The name of the field to match against
 * @returns Validation function
 */
export function validateMatch(matchField: string, matchFieldName: string) {
  return (value: string): string | undefined => {
    if (value !== matchField) {
      return `Must match ${matchFieldName}`;
    }
    return undefined;
  };
}

/**
 * Validates a healing name
 *
 * @param healingName - The healing name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateHealingName(healingName: string): string | undefined {
  if (healingName.trim().length < 2) {
    return 'Healing name must be at least 2 characters';
  }
  if (healingName.trim().length > 50) {
    return 'Healing name must be no more than 50 characters';
  }
  return undefined;
}

/**
 * Validates a chat message
 *
 * @param message - The message to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateChatMessage(message: string): string | undefined {
  if (message.trim().length === 0) {
    return 'Message cannot be empty';
  }
  if (message.trim().length > 1000) {
    return 'Message must be no more than 1000 characters';
  }
  return undefined;
}

/**
 * Validates a reflection submission
 *
 * @param reflection - The reflection text to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateReflection(reflection: string): string | undefined {
  if (reflection.trim().length === 0) {
    return 'Reflection cannot be empty';
  }
  if (reflection.trim().length > 5000) {
    return 'Reflection must be no more than 5000 characters';
  }
  return undefined;
}

/**
 * Validates a milestone value
 *
 * @param milestone - The milestone to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateMilestone(milestone: string): string | undefined {
  const validMilestones = ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30', 'Day 60', 'Day 90'];
  if (!validMilestones.includes(milestone)) {
    return 'Please select a valid milestone';
  }
  return undefined;
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

// Legacy validation functions that return boolean for backward compatibility

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
