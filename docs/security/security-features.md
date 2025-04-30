# Security Features Documentation

## Overview

The Sacred Healing Companion & Journey Hub implements comprehensive security measures to protect user data, ensure privacy, and maintain the integrity of the platform. This document outlines the security features implemented across the application.

## Authentication Security

### JWT Authentication

- **Short-Lived Access Tokens**: Access tokens expire after 15 minutes to minimize the risk of token theft
- **Secure Refresh Tokens**: Refresh tokens are stored in HTTP-only cookies and expire after 7 days
- **Token Verification**: All protected routes verify token authenticity and expiration
- **Secure Token Generation**: Tokens are generated using strong cryptographic methods

### Password Security

- **Bcrypt Hashing**: Passwords are hashed using bcrypt with a salt factor of 10
- **Password Requirements**: Minimum 8 characters, including uppercase, lowercase, numbers, and special characters
- **Brute Force Protection**: Rate limiting on login attempts (10 per minute per IP)
- **Secure Password Reset**: Secure, time-limited password reset flow

## API Security

### Request Validation

- **Input Validation**: All API inputs are validated using JSON schema validation
- **Sanitization**: User inputs are sanitized to prevent injection attacks
- **Type Checking**: Strong type checking for all API parameters

### Rate Limiting

- **Global Rate Limiting**: All API routes have basic rate limiting (60 requests per minute)
- **Authentication Rate Limiting**: Stricter limits on authentication endpoints (5-10 requests per minute)
- **IP-Based Limiting**: Rate limits are applied per IP address
- **User-Based Limiting**: Additional rate limits for authenticated users

### CSRF Protection

- **CSRF Tokens**: All mutating requests require a valid CSRF token
- **Token Rotation**: CSRF tokens are rotated regularly
- **Same-Site Cookies**: Cookies are set with SameSite=Strict attribute

## Data Security

### Privacy Controls

- **Zero Data Retention**: Option for users to opt out of data storage for chatbot conversations
- **Minimal Data Collection**: Only essential data is collected from users
- **Data Encryption**: Sensitive data is encrypted in transit and at rest
- **Data Isolation**: User data is isolated and accessible only to the user

### Secure Storage

- **Airtable Security**: User data is stored in Airtable with secure access controls
- **Environment Variables**: API keys and secrets are stored as environment variables
- **No Client-Side Secrets**: No sensitive information is exposed to the client

## Transport Security

### HTTPS

- **TLS Encryption**: All communication is encrypted using HTTPS
- **HSTS**: HTTP Strict Transport Security is enabled
- **Secure Cookies**: Cookies are set with the Secure attribute

### Content Security

- **Content Security Policy**: Strict CSP to prevent XSS attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **Referrer Policy**: Controls referrer information

## Implementation Details

### Security Middleware

The application uses several security middleware components:

#### Helmet

Helmet is used to set secure HTTP headers:

```javascript
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
```

#### CSRF Protection

CSRF protection is implemented using the csurf package:

```javascript
const csrfProtection = csrf({ cookie: true });

app.use('/api', (req, res, next) => {
  // Skip CSRF protection for webhook routes
  if (req.path.startsWith('/webhook')) {
    return next();
  }

  // Apply CSRF protection
  csrfProtection(req, res, next);
});
```

#### Rate Limiting

Custom rate limiting middleware is implemented:

```javascript
export function rateLimit(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 60 // 60 requests per minute
  } = options;

  // Store request counts by IP
  const requestCounts = {};

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Initialize or clean up old entries
    requestCounts[ip] = requestCounts[ip]
      ? requestCounts[ip].filter(time => now - time < windowMs)
      : [];

    // Check if rate limit exceeded
    if (requestCounts[ip].length >= maxRequests) {
      return sendErrorResponse(res, 'Too many requests, please try again later', 429);
    }

    // Add current request timestamp
    requestCounts[ip].push(now);

    // Proceed with the request
    next();
  };
}
```

### Webhook Security

For webhooks from external services like Typeform:

```javascript
export function verifyTypeformSignature(options = {}) {
  const {
    headerName = 'typeform-signature',
    secret = process.env.TYPEFORM_WEBHOOK_SECRET
  } = options;

  return (req, res, next) => {
    // Get the signature from the header
    const signature = req.headers[headerName.toLowerCase()];

    if (!signature) {
      return sendErrorResponse(res, 'Webhook verification failed: Missing signature', 401);
    }

    try {
      // Get the raw body
      const rawBody = JSON.stringify(req.body);

      // Create the HMAC
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(rawBody);
      const calculatedSignature = 'sha256=' + hmac.digest('hex');

      // Compare signatures
      if (signature !== calculatedSignature) {
        return sendErrorResponse(res, 'Webhook verification failed: Invalid signature', 401);
      }

      // Signature is valid, proceed
      next();
    } catch (error) {
      return sendErrorResponse(res, 'Webhook verification failed: ' + error.message, 500);
    }
  };
}
```

## Security Testing

### Automated Testing

- **Unit Tests**: Security middleware and functions are tested with unit tests
- **Integration Tests**: Authentication flow is tested with integration tests
- **End-to-End Tests**: Security features are tested with end-to-end tests

### Manual Testing

- **Penetration Testing**: Regular penetration testing to identify vulnerabilities
- **Code Reviews**: Security-focused code reviews for all changes
- **Dependency Scanning**: Regular scanning of dependencies for vulnerabilities

## Security Best Practices

### Frontend Security

- **No Sensitive Data**: No sensitive data is stored in localStorage or sessionStorage
- **XSS Prevention**: React's built-in XSS protection and CSP
- **Secure Forms**: Forms have CSRF protection and proper validation
- **Secure Authentication**: Tokens are stored securely and refreshed properly

### Backend Security

- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Errors are handled properly without leaking sensitive information
- **Dependency Management**: Dependencies are kept up-to-date
- **Secure Defaults**: Security features are enabled by default

## Incident Response

### Monitoring

- **Error Logging**: Errors are logged using Sentry
- **Security Events**: Security-related events are logged and monitored
- **Alerts**: Alerts are set up for suspicious activities

### Response Plan

- **Containment**: Procedures for containing security incidents
- **Investigation**: Process for investigating security incidents
- **Remediation**: Steps for remediating security issues
- **Communication**: Plan for communicating security incidents to users

## Future Enhancements

Planned security enhancements include:
- **Security Headers**: Additional security headers for better protection
- **Two-Factor Authentication**: Adding 2FA for enhanced account security
- **IP Blocking**: Blocking suspicious IP addresses
- **Audit Logging**: Comprehensive logging of security-relevant events
- **Automated Security Testing**: Integration of security testing into CI/CD pipeline
