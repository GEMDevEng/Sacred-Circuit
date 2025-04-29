import { ApiResponse } from '../types';

/**
 * Creates a successful API response
 * 
 * @param data - The data to include in the response
 * @returns A standardized successful API response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates an error API response
 * 
 * @param error - The error message
 * @returns A standardized error API response
 */
export function createErrorResponse(error: string): ApiResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handles API errors and returns a standardized error response
 * 
 * @param error - The error object
 * @returns A standardized error API response
 */
export function handleApiError(error: unknown): ApiResponse<never> {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return createErrorResponse(error.message);
  }
  
  return createErrorResponse('An unknown error occurred');
}
