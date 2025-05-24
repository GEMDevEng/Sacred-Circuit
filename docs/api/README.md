# Sacred Healing Hub API

Comprehensive API documentation for the Sacred Healing Hub application

**Version:** 1.0.0

**Contact:** support@sacredhealinghub.com

## Servers

- **Development server:** http://localhost:3001
- **Production server:** https://sacred-healing-hub.vercel.app

## Authentication

This API uses Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## System

### GET /api/health

Check the health status of the API server

**Responses:**

- **200:** Server is healthy

## Authentication

### POST /api/auth/register

Register a new user account

**Request Body:**

```json
{
  "type": "object",
  "required": [
    "email",
    "password",
    "healingName"
  ],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "example": "user@example.com",
      "description": "User email address"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "example": "securePassword123",
      "description": "User password (minimum 8 characters)"
    },
    "healingName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 50,
      "example": "Healing Soul",
      "description": "User healing name for the platform"
    }
  }
}
```

**Responses:**

- **201:** User registered successfully
- **400:** Invalid input data
- **409:** User already exists

### POST /api/auth/login

Authenticate user and return access token

**Request Body:**

```json
{
  "type": "object",
  "required": [
    "email",
    "password"
  ],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "example": "user@example.com"
    },
    "password": {
      "type": "string",
      "example": "securePassword123"
    }
  }
}
```

**Responses:**

- **200:** Login successful
- **401:** Invalid credentials

### POST /api/auth/logout

Logout user and invalidate token

**Authentication required:** Yes

**Responses:**

- **200:** Logout successful

### GET /api/auth/me

Get current authenticated user information

**Authentication required:** Yes

**Responses:**

- **200:** User information retrieved successfully
- **401:** Unauthorized

## Chat

### POST /api/chat

Send a message to the AI chatbot and receive a response

**Authentication required:** Yes

**Request Body:**

```json
{
  "type": "object",
  "required": [
    "message",
    "healingName"
  ],
  "properties": {
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 1000,
      "example": "I am feeling anxious today. Can you help me?",
      "description": "User message to the chatbot"
    },
    "healingName": {
      "type": "string",
      "example": "Healing Soul",
      "description": "User healing name for personalized responses"
    },
    "conversationId": {
      "type": "string",
      "example": "conv_123456",
      "description": "Optional conversation ID for context"
    }
  }
}
```

**Responses:**

- **200:** Chat response generated successfully
- **400:** Invalid input data
- **429:** Rate limit exceeded

## Reflection

### POST /api/reflection

Submit a personal reflection for a specific milestone

**Authentication required:** Yes

**Request Body:**

```json
{
  "type": "object",
  "required": [
    "content",
    "milestone"
  ],
  "properties": {
    "content": {
      "type": "string",
      "minLength": 10,
      "maxLength": 5000,
      "example": "Today I reflected on my journey and felt grateful for the progress I have made.",
      "description": "Reflection content"
    },
    "milestone": {
      "type": "string",
      "enum": [
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly"
      ],
      "example": "daily",
      "description": "Reflection milestone type"
    },
    "mood": {
      "type": "string",
      "enum": [
        "very_negative",
        "negative",
        "neutral",
        "positive",
        "very_positive"
      ],
      "example": "positive",
      "description": "User mood during reflection"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": [
        "gratitude",
        "progress",
        "healing"
      ],
      "description": "Optional tags for categorizing the reflection"
    }
  }
}
```

**Responses:**

- **201:** Reflection submitted successfully
- **400:** Invalid input data

### GET /api/reflection/history

Retrieve user reflection history with optional filtering

**Authentication required:** Yes

**Parameters:**

- **milestone** (query): Filter by milestone type
- **limit** (query): Number of reflections to return
- **offset** (query): Number of reflections to skip

**Responses:**

- **200:** Reflection history retrieved successfully

## Feedback

### POST /api/feedback

Submit user feedback about the application

**Request Body:**

```json
{
  "type": "object",
  "required": [
    "type",
    "message"
  ],
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "bug",
        "feature",
        "improvement",
        "general"
      ],
      "example": "improvement",
      "description": "Type of feedback"
    },
    "message": {
      "type": "string",
      "minLength": 10,
      "maxLength": 1000,
      "example": "The chat interface could be more intuitive.",
      "description": "Feedback message"
    },
    "email": {
      "type": "string",
      "format": "email",
      "example": "user@example.com",
      "description": "Optional email for follow-up"
    },
    "rating": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5,
      "example": 4,
      "description": "Optional rating (1-5 stars)"
    }
  }
}
```

**Responses:**

- **201:** Feedback submitted successfully

