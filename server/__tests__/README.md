# Server Tests Directory

This directory contains tests for the backend of the Sacred Healing Companion & Journey Hub application.

## Directory Structure

```
__tests__/
├── routes/            # Tests for API route handlers
├── services/          # Tests for business logic and API integrations
└── utils/             # Tests for utility functions
```

## Test Categories

### Route Tests

The `routes/` directory contains tests for API route handlers:

- `chat.test.js`: Tests for chat API endpoints
- `reflection.test.js`: Tests for reflection API endpoints
- `webhook.test.js`: Tests for webhook API endpoints

### Service Tests

The `services/` directory contains tests for business logic and API integrations:

- `airtableService.test.js`: Tests for Airtable database operations
- `openaiService.test.js`: Tests for OpenAI API integration

### Utility Tests

The `utils/` directory contains tests for utility functions:

- `response-utils.test.js`: Tests for API response utilities

## Testing Guidelines

1. **Naming**: Name test files with the `.test.js` extension
2. **Structure**: Group tests logically using `describe` blocks
3. **Assertions**: Write clear assertions that test one thing at a time
4. **Mocking**: Use mocks for external dependencies
5. **Coverage**: Aim for at least 80% code coverage

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Generate coverage report: `npm run test:coverage`

## Example Test

```javascript
import { sendChatMessage } from '../../services/openaiService.js';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'This is a test response'
                }
              }
            ]
          })
        }
      }
    }))
  };
});

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendChatMessage', () => {
    test('sends a message to OpenAI and returns the response', async () => {
      const result = await sendChatMessage('Hello', 'TestHealer', false);
      
      expect(result).toEqual({
        message: 'This is a test response',
        timestamp: expect.any(String)
      });
      
      // Check that OpenAI was called with the correct parameters
      const openaiInstance = OpenAI.mock.results[0].value;
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: expect.any(String) },
          { role: 'user', content: 'TestHealer: Hello' }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
    });
  });
});
```
