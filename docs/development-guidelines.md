# Development Guidelines for Sacred Healing Companion & Journey Hub

## Introduction

This document provides practical guidelines for developers working on the Sacred Healing Companion & Journey Hub project. It complements the Project Rules document by offering specific, actionable advice for common development tasks and scenarios.

## Getting Started

### Setting Up Your Development Environment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GEMDevEng/Sacred-Circuit.git
   cd Sacred-Circuit
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in the required API keys and configuration values

4. **Start the Development Server**:
   ```bash
   npm start
   ```
   This will start both the frontend (Vite) and backend (Express) servers concurrently.

## Code Organization

### Frontend (React)

#### Component Structure

Components should follow this structure:

```typescript
// Import statements
import React from 'react';
import { SomeType } from '../../types';

// Interface definitions
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

/**
 * ComponentName - Description of what this component does
 * 
 * @param props - Component properties
 * @returns JSX element
 */
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // State and hooks
  const [state, setState] = React.useState<string>('');

  // Event handlers
  const handleEvent = () => {
    // Implementation
  };

  // Render
  return (
    <div className="component-class">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

#### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the color palette defined in `tailwind.config.js`
- Use the following color scheme:
  - Primary: Soft blue (`#6A9BD8`)
  - Secondary: Warm beige (`#F5F5DC`)
  - Text: Dark gray (`#333333`)
  - Background: Light gray (`#F8F8F8`)
- For complex components, create a separate CSS module file

### Backend (Node.js/Express)

#### Route Structure

Routes should follow this structure:

```javascript
import express from 'express';
import { someController } from '../controllers/someController.js';

const router = express.Router();

/**
 * @route GET /api/resource
 * @desc Get all resources
 * @access Public
 */
router.get('/', someController.getAll);

/**
 * @route POST /api/resource
 * @desc Create a new resource
 * @access Private
 */
router.post('/', someController.create);

export default router;
```

#### Service Structure

Services should follow this structure:

```javascript
/**
 * Service description
 * @param {string} param1 - Description of param1
 * @returns {Promise<object>} - Description of return value
 */
export async function serviceFunction(param1) {
  try {
    // Implementation
    return { success: true, data };
  } catch (error) {
    console.error('Service error:', error);
    throw new Error('Failed to perform operation');
  }
}
```

## Testing Guidelines

### Writing Tests

- Place test files in the `src/__tests__` directory
- Name test files with the `.test.ts` or `.test.tsx` extension
- Group tests logically using `describe` blocks
- Write descriptive test names using `it` or `test`

Example:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from '../components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly with default props', () => {
    render(<ComponentName prop1="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles user interaction correctly', async () => {
    render(<ComponentName prop1="test" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('clicked')).toBeInTheDocument();
  });
});
```

### Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Generate coverage report: `npm run test:coverage`

## Git Workflow

### Branching Strategy

- `main`: Production-ready code
- `feature/<feature-name>`: New features
- `bugfix/<issue-name>`: Bug fixes
- `chore/<task-name>`: Maintenance tasks

### Commit Messages

Follow this format for commit messages:

```
[Type]: Short description

Longer description if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: Add chatbot consent toggle

- Add toggle component for user consent
- Implement state management for consent
- Update API calls to include consent parameter
```

## API Guidelines

### Request/Response Format

All API endpoints should follow this format:

**Request:**
```json
{
  "key1": "value1",
  "key2": "value2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "timestamp": "2023-06-01T12:00:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2023-06-01T12:00:00Z"
}
```

### Error Handling

- Use try/catch blocks for all asynchronous operations
- Return user-friendly error messages
- Log detailed error information for debugging
- Use appropriate HTTP status codes

## Performance Considerations

### Frontend

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images using WebP format
- Use pagination for large data sets

### Backend

- Implement caching for frequently accessed data
- Use pagination for API endpoints that return large data sets
- Optimize database queries
- Implement rate limiting for public endpoints

## Security Best Practices

- Validate all user inputs on both frontend and backend
- Use environment variables for sensitive information
- Implement proper authentication and authorization
- Set secure HTTP headers
- Follow the principle of least privilege

## Accessibility Guidelines

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Documentation

- Document all functions, components, and classes with JSDoc comments
- Keep README files up to date
- Document API endpoints with examples
- Update this guide as needed

## Conclusion

Following these guidelines will help maintain code quality, consistency, and developer productivity throughout the project. If you have questions or suggestions for improving these guidelines, please discuss them with the team.
