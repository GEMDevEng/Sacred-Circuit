# Utils Directory

This directory contains utility functions and helpers used throughout the Sacred Healing Companion & Journey Hub application.

## Files

- `api.ts`: Axios configuration and API request utilities

## API Utilities

The `api.ts` file provides a configured Axios instance and helper functions for making API requests to the backend. It includes:

- A base Axios instance configured with the API base URL
- Error handling middleware
- Helper functions for common API operations

## Guidelines for Adding Utilities

1. **Single Responsibility**: Each utility file should focus on a specific category of functionality
2. **Pure Functions**: Prefer pure functions that don't rely on external state
3. **TypeScript**: Use proper TypeScript typing for all functions
4. **Documentation**: Include JSDoc comments for all functions
5. **Testing**: Create corresponding test files in the `__tests__/utils` directory

## Example Utility Function

```typescript
/**
 * Formats a date string into a human-readable format
 * 
 * @param dateString - ISO date string to format
 * @param format - Optional format (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString();
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
```
