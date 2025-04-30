# Reflection API Endpoints

This document provides detailed information about the reflection API endpoints in the Sacred Healing Companion & Journey Hub application.

## Overview

The reflection API allows users to submit and retrieve reflections about their healing journey. Reflections are stored in Airtable and can be accessed either publicly (using a healing name) or securely (using JWT authentication).

## Endpoints

### Submit Reflection (Public)

```
POST /api/reflection
```

Submits a new reflection for a user identified by their healing name.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "healingName": "SpiritualSeeker",
  "content": "Today I felt a deep connection with nature...",
  "milestone": "Day 7",
  "emailConsent": true
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `healingName` | string | Yes | The user's healing name |
| `content` | string | Yes | The reflection text |
| `milestone` | string | Yes | The milestone (e.g., "Day 7", "Day 14") |
| `emailConsent` | boolean | No | Whether the user consents to receiving emails about their reflection |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "SpiritualSeeker",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  },
  "timestamp": "2023-06-01T12:00:00Z",
  "status": 201
}
```

#### Error Responses

- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server error

### Submit Reflection (Authenticated)

```
POST /api/reflection/secure
```

Submits a new reflection for an authenticated user.

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

#### Request Body

```json
{
  "healingName": "SpiritualSeeker",
  "content": "Today I felt a deep connection with nature...",
  "milestone": "Day 7",
  "emailConsent": true
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `healingName` | string | Yes | The user's healing name |
| `content` | string | Yes | The reflection text |
| `milestone` | string | Yes | The milestone (e.g., "Day 7", "Day 14") |
| `emailConsent` | boolean | No | Whether the user consents to receiving emails about their reflection |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "reflection_id",
    "healingName": "SpiritualSeeker",
    "journeyDay": "Day 7",
    "timestamp": "2023-06-01T12:00:00Z",
    "success": true
  },
  "timestamp": "2023-06-01T12:00:00Z",
  "status": 201
}
```

#### Error Responses

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Server error

### Get Reflections by Healing Name (Public)

```
GET /api/reflection?healingName=SpiritualSeeker
```

Retrieves reflections for a user identified by their healing name.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `healingName` | string | Yes | The user's healing name |

#### Response

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
        "createdAt": "2023-06-01T12:00:00Z"
      },
      {
        "id": "reflection_id_2",
        "healingName": "SpiritualSeeker",
        "content": "I'm noticing changes in my energy levels...",
        "journeyDay": "Day 14",
        "createdAt": "2023-06-08T12:00:00Z"
      }
    ]
  },
  "timestamp": "2023-06-10T12:00:00Z",
  "status": 200
}
```

#### Error Responses

- `400 Bad Request`: Missing healing name
- `500 Internal Server Error`: Server error

### Get Reflections (Authenticated)

```
GET /api/reflection/secure
```

Retrieves reflections for the authenticated user.

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Response

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
        "createdAt": "2023-06-01T12:00:00Z"
      },
      {
        "id": "reflection_id_2",
        "healingName": "SpiritualSeeker",
        "content": "I'm noticing changes in my energy levels...",
        "journeyDay": "Day 14",
        "createdAt": "2023-06-08T12:00:00Z"
      }
    ]
  },
  "timestamp": "2023-06-10T12:00:00Z",
  "status": 200
}
```

### Get Reflections by Healing Name (Authenticated)

```
GET /api/reflection/secure?healingName=SpiritualSeeker
```

Retrieves reflections for a specific healing name, but only if the authenticated user owns that healing name.

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `healingName` | string | Yes | The user's healing name |

#### Response

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
        "createdAt": "2023-06-01T12:00:00Z"
      },
      {
        "id": "reflection_id_2",
        "healingName": "SpiritualSeeker",
        "content": "I'm noticing changes in my energy levels...",
        "journeyDay": "Day 14",
        "createdAt": "2023-06-08T12:00:00Z"
      }
    ]
  },
  "timestamp": "2023-06-10T12:00:00Z",
  "status": 200
}
```

#### Error Responses

- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Attempting to access reflections for a healing name that doesn't belong to the authenticated user
- `500 Internal Server Error`: Server error

## Security Considerations

- Public endpoints use rate limiting to prevent abuse
- Authenticated endpoints use JWT tokens for authorization
- Authenticated users can only access their own reflections
- Input validation is performed on all endpoints to prevent injection attacks
- CSRF protection is applied to all POST endpoints
