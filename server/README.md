# Server Directory

This directory contains the backend code for the Sacred Healing Companion & Journey Hub application, built with Node.js and Express.

## Directory Structure

```
server/
├── routes/            # API route handlers
├── services/          # Business logic and API integrations
└── templates/         # Email templates
```

## Server Components

### Routes

The `routes/` directory contains Express route handlers for the API endpoints:

- `chat.js`: Handles API endpoints for chatbot interactions
- `reflection.js`: Manages API endpoints for user reflection submissions
- `webhook.js`: Processes webhook callbacks from Typeform for user onboarding

### Services

The `services/` directory contains business logic and integrations with external APIs:

- `airtableService.js`: Provides functions for interacting with Airtable database (users and reflections)
- `openaiService.js`: Integrates with OpenAI API for chatbot functionality with spiritual guidance prompts

### Templates

The `templates/` directory contains HTML email templates:

- `welcome.html`: HTML template for welcome emails sent to new users
- `guidance.html`: HTML template for guidance emails sent during the user journey
- `reflection.html`: HTML template for emails prompting users to submit reflections

## Main Server File

The `index.js` file is the entry point for the Express server. It:

1. Configures middleware (CORS, JSON parsing, etc.)
2. Sets up API routes
3. Serves static files in production
4. Implements rate limiting and security measures
5. Starts the server on the specified port

## API Endpoints

### Chat API

- `POST /api/chat`: Send a message to the chatbot
  - Request body: `{ message: string, healingName: string, storeConversation: boolean }`
  - Response: `{ message: string, timestamp: string }`

### Reflection API

- `POST /api/reflection`: Submit a reflection
  - Request body: `{ healingName: string, content: string, milestone: string }`
  - Response: `{ success: boolean, data?: object, error?: string, timestamp: string }`

### Webhook API

- `POST /api/webhook`: Receive webhook callbacks from Typeform
  - Request body: Typeform webhook payload
  - Response: `{ success: boolean, message: string }`

## Development Guidelines

1. **Error Handling**: Use try/catch blocks for all asynchronous operations
2. **Validation**: Validate all request data before processing
3. **Logging**: Log important events and errors for debugging
4. **Security**: Follow security best practices (input validation, rate limiting, etc.)
5. **Documentation**: Include JSDoc comments for all functions

## Example Route Handler

```javascript
import express from 'express';
import { someService } from '../services/someService.js';

const router = express.Router();

/**
 * @route POST /api/resource
 * @desc Create a new resource
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { param1, param2 } = req.body;
    
    // Validate input
    if (!param1 || !param2) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }
    
    // Process request
    const result = await someService(param1, param2);
    
    // Return response
    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
```
