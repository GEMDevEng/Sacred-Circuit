# Sacred Healing Hub API Documentation

This document provides detailed information about the Sacred Healing Hub API endpoints, including authentication, request/response formats, and example usage.

## Base URL

All API endpoints are relative to the base URL:

```
https://your-domain.com/api
```

## Authentication

### JWT Authentication

Protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

To obtain a JWT token, use the login endpoint:

```
POST /auth/login
```

## API Endpoints

### Authentication Endpoints

#### Register a New User

```
POST /auth/register
```

**Request Body:**
```json
{
  "healingName": "SpiritualSeeker",
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "SpiritualSeeker",
      "email": "user@example.com",
      "role": "user"
    },
    "accessToken": "jwt_token"
  }
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "SpiritualSeeker",
      "email": "user@example.com",
      "role": "user"
    },
    "accessToken": "jwt_token"
  }
}
```

#### Refresh Token

```
POST /auth/refresh
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### Logout

```
POST /auth/logout
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### Get Current User

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "SpiritualSeeker",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### Chat Endpoints

#### Process Chat Message (Public)

```
POST /chat
```

**Request Body:**
```json
{
  "message": "How can I start my healing journey?",
  "healingName": "SpiritualSeeker",
  "storeConversation": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Starting your healing journey is a beautiful step...",
    "timestamp": "2023-06-01T12:00:00Z"
  }
}
```

#### Process Chat Message (Authenticated)

```
POST /chat/secure
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "message": "How can I start my healing journey?",
  "healingName": "SpiritualSeeker",
  "storeConversation": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Starting your healing journey is a beautiful step...",
    "timestamp": "2023-06-01T12:00:00Z"
  }
}
```

### Reflection Endpoints

#### Submit Reflection (Public)

```
POST /reflection
```

**Request Body:**
```json
{
  "healingName": "SpiritualSeeker",
  "content": "Today I felt a deep connection with nature...",
  "milestone": "Day 7",
  "emailConsent": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "SpiritualSeeker",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  }
}
```

#### Submit Reflection (Authenticated)

```
POST /reflection/secure
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "healingName": "SpiritualSeeker",
  "content": "Today I felt a deep connection with nature...",
  "milestone": "Day 7",
  "emailConsent": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "SpiritualSeeker",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  }
}
```

#### Get Reflections by Healing Name

```
GET /reflection?healingName=SpiritualSeeker
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reflections": [
      {
        "id": "reflection_id",
        "healingName": "SpiritualSeeker",
        "content": "Today I felt a deep connection with nature...",
        "journeyDay": "Day 7",
        "timestamp": "2023-06-01T12:00:00Z"
      },
      {
        "id": "reflection_id_2",
        "healingName": "SpiritualSeeker",
        "content": "I'm noticing changes in my energy levels...",
        "journeyDay": "Day 14",
        "timestamp": "2023-06-08T12:00:00Z"
      }
    ]
  }
}
```

### Webhook Endpoints

#### Typeform Webhook

```
POST /webhook/typeform
```

**Headers:**
```
typeform-signature: sha256=<signature>
```

**Request Body:**
```json
{
  "form_response": {
    "form_id": "form_id",
    "submitted_at": "2023-06-01T12:00:00Z",
    "answers": [
      {
        "field": {
          "id": "field_id",
          "ref": "healing_name",
          "type": "short_text"
        },
        "text": "SpiritualSeeker"
      },
      {
        "field": {
          "id": "field_id",
          "ref": "email",
          "type": "email"
        },
        "email": "user@example.com"
      },
      {
        "field": {
          "id": "field_id",
          "ref": "healing_goals",
          "type": "long_text"
        },
        "text": "I want to find inner peace and balance."
      },
      {
        "field": {
          "id": "field_id",
          "ref": "fasting_experience",
          "type": "multiple_choice"
        },
        "choice": {
          "label": "Some experience (1-2 fasts)"
        }
      },
      {
        "field": {
          "id": "field_id",
          "ref": "email_consent",
          "type": "yes_no"
        },
        "boolean": true
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Webhook processed successfully",
    "userId": "user_id"
  }
}
```

## Error Handling

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 10 requests per minute
- Chat endpoints: 20 requests per minute
- Reflection endpoints: 10 requests per minute

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.

## Data Privacy

### Zero Data Retention

For chat messages, you can opt out of data storage by setting `storeConversation: false` in your request. This ensures that your conversation is not stored in our database.

### Email Consent

For reflections, you can control email communications by setting `emailConsent: true/false` in your request.

## API Client Example

### JavaScript/Node.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-domain.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example: Login
async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data.data;
    
    // Store token
    localStorage.setItem('token', accessToken);
    
    return user;
  } catch (error) {
    console.error('Login error:', error.response?.data?.error || error.message);
    throw error;
  }
}

// Example: Send chat message
async function sendChatMessage(message, healingName, storeConversation = true) {
  try {
    const response = await api.post('/chat/secure', {
      message,
      healingName,
      storeConversation
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Chat error:', error.response?.data?.error || error.message);
    throw error;
  }
}
```

## Webhook Integration

### Typeform Webhook Setup

1. In your Typeform dashboard, go to Connect > Webhooks
2. Add a new webhook with the URL: `https://your-domain.com/api/webhook/typeform`
3. Generate a signing secret and add it to your environment variables as `TYPEFORM_WEBHOOK_SECRET`
4. Configure the webhook to send form responses

## API Versioning

The current API version is v1. The version is implicit in the endpoints.

Future API versions will be available at `/api/v2/`, etc.

## Support

For API support, please contact:

- Email: support@sacredhealinghub.com
- Documentation: https://docs.sacredhealinghub.com
