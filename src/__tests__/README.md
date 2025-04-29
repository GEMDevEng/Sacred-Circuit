# Tests Directory

This directory contains all tests for the Sacred Healing Companion & Journey Hub application.

## Directory Structure

```
__tests__/
├── __mocks__/           # Mock implementations for testing
├── components/          # Tests for React components
└── utils/               # Tests for utility functions
```

## Test Categories

### Mocks

The `__mocks__/` directory contains mock implementations of external dependencies:

- `Button.tsx`: Mock implementation of the Button component
- `framer-motion.tsx`: Mock implementation of framer-motion
- `react-router-dom.tsx`: Mock implementation of react-router-dom

### Component Tests

The `components/` directory contains tests for React components:

- `ChatbotPage.test.tsx`: Tests for the ChatbotPage component
- `ReflectionPage.test.tsx`: Tests for the ReflectionPage component

### Utility Tests

The `utils/` directory contains tests for utility functions:

- `api.test.ts`: Tests for API utility functions

## Testing Guidelines

1. **Naming**: Name test files with the `.test.ts` or `.test.tsx` extension
2. **Structure**: Group tests logically using `describe` blocks
3. **Assertions**: Write clear assertions that test one thing at a time
4. **Mocking**: Use mocks for external dependencies
5. **Coverage**: Aim for at least 80% code coverage

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Generate coverage report: `npm run test:coverage`

## Example Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/common/Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    render(<Button className="custom-class">Click Me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```
