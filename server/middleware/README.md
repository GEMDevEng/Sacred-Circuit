# Middleware Directory

This directory contains Express middleware functions used in the Sacred Healing Companion & Journey Hub application.

## Files

- `validation.js`: Middleware for validating request data
- `security.js`: Middleware for security features like signature verification and rate limiting

## Validation Middleware

The `validation.js` file provides middleware for validating incoming requests against schemas:

- `validateRequest`: Creates middleware that validates a request against a schema
- `chatRequestSchema`: Schema for validating chat requests
- `reflectionRequestSchema`: Schema for validating reflection requests
- `webhookRequestSchema`: Schema for validating webhook requests

## Security Middleware

The `security.js` file provides middleware for security features:

- `verifyTypeformSignature`: Verifies Typeform webhook signatures to ensure requests are authentic
- `rateLimit`: Implements rate limiting to prevent abuse of API endpoints

## Guidelines for Adding Middleware

1. **Single Responsibility**: Each middleware function should focus on a specific task
2. **Error Handling**: Properly handle errors and pass them to the next middleware
3. **Documentation**: Include JSDoc comments for all middleware functions
4. **Testing**: Create corresponding test files for all middleware
5. **Reusability**: Design middleware to be reusable across different routes

## Example Usage

### Validation Middleware

```javascript
import { validateRequest, chatRequestSchema } from '../middleware/validation.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

router.post('/', validateRequest(chatRequestSchema), async (req, res) => {
  try {
    // Request body is validated against chatRequestSchema
    const { message, healingName, storeConversation = false } = req.body;

    // Process the request...

    return sendSuccessResponse(res, response);
  } catch (error) {
    return handleAndSendError(res, error);
  }
});
```

### Security Middleware

```javascript
import { verifyTypeformSignature, rateLimit } from '../middleware/security.js';

router.post('/webhook',
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }), // 10 requests per minute
  verifyTypeformSignature({ secret: process.env.WEBHOOK_SECRET }),
  async (req, res) => {
    try {
      // Request is rate limited and signature is verified

      // Process the webhook...

      return sendSuccessResponse(res, { message: 'Webhook processed' });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);
```
