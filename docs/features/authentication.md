# Authentication System Documentation

## Overview

The Authentication System in the Sacred Healing Companion & Journey Hub provides secure user authentication and authorization using JSON Web Tokens (JWT). It enables users to register, login, and access protected features while maintaining privacy and security.

## User Experience

### Registration

Users can register through:
1. The "Sign Up" link in the navigation menu
2. The registration form linked from the login page
3. Prompts within the application for unauthenticated users

The registration process:
1. User enters their Healing Name, email, and password
2. System validates the input and checks for existing accounts
3. Upon successful registration, the user is automatically logged in
4. User receives a welcome message and is directed to the home page

### Login

Users can login through:
1. The "Login" link in the navigation menu
2. Prompts when attempting to access protected features

The login process:
1. User enters their email and password
2. System validates the credentials
3. Upon successful login, the user is directed to the home page or the page they were attempting to access

### Protected Features

The following features require authentication:
1. Secure chatbot interactions with conversation history
2. Secure reflection submissions and history
3. User profile management
4. Administrative features (for admin users)

## Features

### User Authentication

- **JWT-Based Authentication**: Secure token-based authentication
- **Short-Lived Access Tokens**: 15-minute expiration for security
- **Refresh Tokens**: 7-day expiration with secure HTTP-only cookies
- **Remember Me**: Option to extend session duration

### User Authorization

- **Role-Based Access Control**: Different access levels for users and admins
- **Protected Routes**: Frontend and backend route protection
- **Resource Authorization**: Users can only access their own data

### Security Features

- **Password Hashing**: Secure password storage using bcrypt
- **CSRF Protection**: Protection against cross-site request forgery
- **Rate Limiting**: Prevention of brute force attacks
- **Secure Cookies**: HTTP-only cookies for refresh tokens
- **Token Refresh**: Automatic refresh of expired tokens

## Technical Implementation

### Frontend Components

- **AuthContext.tsx**: Context provider for authentication state
- **LoginPage.tsx**: Component for the login form
- **RegisterPage.tsx**: Component for the registration form
- **ProtectedRoute.tsx**: Component for protecting routes
- **useAuth.ts**: Custom hook for accessing authentication state

### Backend Services

- **authService.js**: Service for authentication operations
- **auth.js**: API route handler for authentication endpoints
- **auth.js (middleware)**: Middleware for token verification

### API Endpoints

#### POST /api/auth/register

Registers a new user.

**Request Body:**
```json
{
  "healingName": "User's healing name",
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "User's healing name",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-06-01T12:00:00Z"
    },
    "accessToken": "jwt_access_token"
  }
}
```

#### POST /api/auth/login

Logs in a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "User's healing name",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-06-01T12:00:00Z"
    },
    "accessToken": "jwt_access_token"
  }
}
```

#### POST /api/auth/refresh

Refreshes an access token using a refresh token.

**Cookies:**
```
refreshToken=jwt_refresh_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

#### POST /api/auth/logout

Logs out a user.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /api/auth/me

Gets the current user's information.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "healingName": "User's healing name",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-06-01T12:00:00Z"
    }
  }
}
```

### Token Flow

#### Authentication Flow

1. User submits login credentials
2. Backend validates credentials and generates tokens
3. Access token is returned in the response
4. Refresh token is set as an HTTP-only cookie
5. Frontend stores the access token in localStorage
6. Frontend includes the access token in subsequent API requests

#### Token Refresh Flow

1. Frontend detects an expired access token
2. Frontend sends a refresh request with the refresh token cookie
3. Backend validates the refresh token and generates a new access token
4. New access token is returned to the frontend
5. Frontend updates the stored access token
6. Frontend retries the original request with the new access token

## Database Schema

User authentication data is stored in Airtable with the following schema:

| Field | Type | Description |
|-------|------|-------------|
| Healing Name | Text | The user's healing name |
| Email | Email | The user's email address |
| Password | Text | Bcrypt-hashed password |
| Role | Text | User role (user, admin) |
| Registration Date | Date/Time | When the user registered |
| Last Login | Date/Time | When the user last logged in |
| Journey Status | Text | Status of the user's journey |

## Testing

### Unit Tests

Unit tests for the authentication system are located in:
- `src/__tests__/contexts/AuthContext.test.tsx`
- `src/__tests__/components/auth/LoginPage.test.tsx`
- `src/__tests__/components/auth/RegisterPage.test.tsx`
- `src/__tests__/components/auth/ProtectedRoute.test.tsx`
- `server/__tests__/routes/auth.test.js`
- `server/__tests__/services/authService.test.js`
- `server/__tests__/middleware/auth.test.js`

### Integration Tests

Integration tests for the authentication system are located in:
- `src/__tests__/integration/auth-flow.test.tsx`

### End-to-End Tests

End-to-end tests for the authentication system are located in:
- `cypress/e2e/authentication.cy.js`
- `cypress/e2e/authentication-flow.cy.js`

## Security Considerations

- **Password Requirements**: Minimum 8 characters, including uppercase, lowercase, numbers, and special characters
- **Rate Limiting**: Limits login attempts to prevent brute force attacks
- **Token Expiration**: Short-lived access tokens (15 minutes) and longer refresh tokens (7 days)
- **Secure Storage**: Passwords are hashed using bcrypt with a salt
- **HTTPS**: All communication is encrypted using HTTPS
- **CSRF Protection**: All authentication endpoints are protected against CSRF attacks
- **HTTP-Only Cookies**: Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks

## Future Enhancements

Planned enhancements for the authentication system include:
- **Multi-Factor Authentication**: Adding support for 2FA using authenticator apps
- **Social Login**: Adding support for login with Google, Facebook, etc.
- **Password Reset**: Implementing a secure password reset flow
- **Account Verification**: Adding email verification for new accounts
- **Session Management**: Allowing users to view and manage active sessions
