# Server Utilities Directory

This directory contains utility functions used throughout the backend of the Sacred Healing Companion & Journey Hub application.

## Files

- `response-utils.js`: Utilities for creating standardized API responses

## Response Utilities

The `response-utils.js` file provides functions for creating and sending standardized API responses:

- `createSuccessResponse`: Creates a success response object
- `createErrorResponse`: Creates an error response object
- `handleApiError`: Handles API errors and returns a standardized error response
- `sendSuccessResponse`: Sends a success response to the client
- `sendErrorResponse`: Sends an error response to the client
- `handleAndSendError`: Handles an API error and sends a standardized error response

## Guidelines for Adding Utilities

1. **Single Responsibility**: Each utility file should focus on a specific category of functionality
2. **Pure Functions**: Prefer pure functions that don't rely on external state
3. **Documentation**: Include JSDoc comments for all functions
4. **Error Handling**: Implement proper error handling in all utilities
5. **Testing**: Create corresponding test files for all utilities

## Example Usage

```javascript
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

/**
 * Get user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getUser(req, res) {
  try {
    const { healingName } = req.params;
    
    // Validate input
    if (!healingName) {
      return sendErrorResponse(res, 'Healing name is required', 400);
    }
    
    // Get user data
    const user = await getUserByHealingName(healingName);
    
    // Return response
    return sendSuccessResponse(res, user);
  } catch (error) {
    return handleAndSendError(res, error);
  }
}
```
