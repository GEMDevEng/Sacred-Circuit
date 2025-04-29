# Sacred Healing Hub Codebase Index

This document provides a comprehensive index of the Sacred Healing Hub codebase, including directories, files, and their purposes.

## Directory Structure

```
sacred-healing-hub/
├── docs/                         # Project documentation
├── public/                       # Static frontend assets
├── server/                       # Backend code (Node.js/Express)
│   ├── routes/                   # API route handlers
│   ├── services/                 # Business logic and API integrations
│   ├── middleware/               # Express middleware
│   ├── utils/                    # Utility functions
│   └── __tests__/                # Backend tests
├── src/                          # Frontend code (React)
│   ├── components/               # React components
│   │   ├── chatbot/              # Chatbot-related components
│   │   ├── common/               # Shared UI components
│   │   └── landing/              # Landing page components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript type definitions
│   ├── styles/                   # Global styles
│   └── __tests__/                # Frontend tests
```

## Key Files

### Frontend

#### Main Application Files
- `src/main.tsx`: Entry point for the React application
- `src/App.tsx`: Main React component with routing configuration
- `src/styles/globals.css`: Global CSS styles

#### Components
- `src/components/common/Button.tsx`: Reusable button component
- `src/components/common/Footer.tsx`: Footer component
- `src/components/common/Header.tsx`: Header component
- `src/components/common/Layout.tsx`: Layout wrapper component
- `src/components/chatbot/ChatbotPage.tsx`: Main chatbot interface
- `src/components/landing/LandingPage.tsx`: Landing page
- `src/components/landing/ReflectionPage.tsx`: Reflection submission page

#### Utilities
- `src/utils/api.ts`: API client for backend communication
- `src/utils/validators.ts`: Input validation functions

#### Types
- `src/types/index.ts`: TypeScript type definitions

### Backend

#### Main Server Files
- `server/index.js`: Express server entry point

#### Routes
- `server/routes/chat.js`: Chat API endpoints
- `server/routes/reflection.js`: Reflection API endpoints
- `server/routes/webhook.js`: Webhook API endpoints

#### Services
- `server/services/airtableService.js`: Airtable database operations
- `server/services/openaiService.js`: OpenAI API integration

#### Middleware
- `server/middleware/validation.js`: Request validation middleware
- `server/middleware/security.js`: Security middleware

#### Utilities
- `server/utils/response-utils.js`: API response utilities
- `server/utils/validators.js`: Input validation functions

### Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `jest.config.js`: Jest testing configuration
- `eslint.config.js`: ESLint configuration

## Missing Components

Based on the implementation plan, the following components need to be implemented:

### Authentication
- User authentication service
- JWT token handling
- Protected routes
- User profile management

### Frontend Components
- Form components with validation
- Error handling components
- Loading state components

### Testing
- Additional test coverage for components
- Authentication tests
- Form validation tests

## Security Issues

The following security vulnerabilities need to be addressed:

1. Dependency vulnerabilities:
   - `mailchimp-api-v3` depends on vulnerable versions of `request` and `tar`
   - `vite` depends on vulnerable versions of `esbuild`
   - Other minor vulnerabilities in development dependencies

2. Missing authentication implementation:
   - No JWT implementation
   - No protected routes
   - No user authentication flow
