/**
 * Utility functions for creating standardized API responses
 */

/**
 * Creates a success response
 * 
 * @param {Object|Array|null} data - The data to include in the response
 * @param {number} [status=200] - The HTTP status code
 * @returns {Object} A standardized success response object
 */
export function createSuccessResponse(data = null, status = 200) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    status
  };
}

/**
 * Creates an error response
 * 
 * @param {string} error - The error message
 * @param {number} [status=400] - The HTTP status code
 * @returns {Object} A standardized error response object
 */
export function createErrorResponse(error, status = 400) {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    status
  };
}

/**
 * Handles API errors and returns a standardized error response
 * 
 * @param {Error} error - The error object
 * @param {number} [status=500] - The HTTP status code
 * @returns {Object} A standardized error response object
 */
export function handleApiError(error, status = 500) {
  console.error('API Error:', error);
  
  return createErrorResponse(
    error.message || 'An unexpected error occurred',
    status
  );
}

/**
 * Sends a success response
 * 
 * @param {Object} res - Express response object
 * @param {Object|Array|null} data - The data to include in the response
 * @param {number} [status=200] - The HTTP status code
 */
export function sendSuccessResponse(res, data = null, status = 200) {
  const response = createSuccessResponse(data, status);
  res.status(status).json(response);
}

/**
 * Sends an error response
 * 
 * @param {Object} res - Express response object
 * @param {string} error - The error message
 * @param {number} [status=400] - The HTTP status code
 */
export function sendErrorResponse(res, error, status = 400) {
  const response = createErrorResponse(error, status);
  res.status(status).json(response);
}

/**
 * Handles an API error and sends a standardized error response
 * 
 * @param {Object} res - Express response object
 * @param {Error} error - The error object
 * @param {number} [status=500] - The HTTP status code
 */
export function handleAndSendError(res, error, status = 500) {
  const response = handleApiError(error, status);
  res.status(response.status).json(response);
}
