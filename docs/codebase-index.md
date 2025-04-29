# Sacred Healing Companion & Journey Hub - Codebase Index

This document provides a comprehensive, up-to-date index of the Sacred Healing Companion & Journey Hub codebase, including directories, files, their purposes, missing components, and known security issues. It is intended as a reference for developers to quickly locate and understand the purpose of each file and directory in the project.

## Directory Structure Overview
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

## Backend Files

### Main Server Files
- **server/index.js**: Express server entry point

### Routes
- **server/routes/chat.js**: Chat API endpoints
- **server/routes/reflection.js**: Reflection API endpoints
- **server/routes/webhook.js**: Webhook API endpoints

### Services
- **server/services/airtableService.js**: Airtable database operations
- **server/services/openaiService.js**: OpenAI API integration

### Middleware
- **server/middleware/validation.js**: Request validation middleware
- **server/middleware/security.js**: Security middleware

### Utilities
- **server/utils/response-utils.js**: API response utilities
- **server/utils/validators.js**: Input validation functions

### Email Templates
- **server/templates/welcome.html**: HTML template for welcome emails
- **server/templates/guidance.html**: HTML template for guidance emails
- **server/templates/reflection.html**: HTML template for reflection prompts

## Frontend Files

### Main Application Files
- **src/main.tsx**: Entry point for the React application
- **src/App.tsx**: Main React component with routing configuration
- **src/styles/globals.css**: Global CSS styles

### Components
- **src/components/common/Button.tsx**: Reusable button component
- **src/components/common/Footer.tsx**: Footer component
- **src/components/common/Header.tsx**: Header component
- **src/components/common/Layout.tsx**: Layout wrapper component
- **src/components/chatbot/ChatbotPage.tsx**: Main chatbot interface
- **src/components/landing/LandingPage.tsx**: Landing page
- **src/components/landing/ReflectionPage.tsx**: Reflection submission page

### Utilities
- **src/utils/api.ts**: API client for backend communication
- **src/utils/validators.ts**: Input validation functions

### Types
- **src/types/index.ts**: TypeScript type definitions

### Tests
- **src/__tests__/basic.test.ts**: Basic test setup verification
- **src/__tests__/components/ChatbotPage.test.tsx**: Tests for the ChatbotPage component
- **src/__tests__/components/ReflectionPage.test.tsx**: Tests for the ReflectionPage component
- **src/__tests__/utils/api.test.ts**: Tests for API utility functions

### Styles
- **src/styles/global.css**: Global CSS styles and Tailwind CSS imports

## Configuration Files
- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **vite.config.ts**: Vite configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **jest.config.js**: Jest testing configuration
- **eslint.config.js**: ESLint configuration
- **postcss.config.js**: PostCSS configuration

## Documentation Files
- **docs/app-flow.md**: Documents the user flow through the application
- **docs/backend-structure.md**: Backend architecture and components
- **docs/design-system.md**: Design system and UI components
- **docs/directory-structure.md**: Project directory organization
- **docs/features-results.md**: Features and expected outcomes
- **docs/frontend-guidelines.md**: Frontend development guidelines
- **docs/implementation-plan.md**: Implementation plan
- **docs/product-requirements.md**: Product requirements
- **docs/project-rules.md**: Project rules and standards
- **docs/security-guidelines.md**: Security best practices
- **docs/tech-stack.md**: Technology stack details

## File Relationships

### Frontend Component Hierarchy
- **Layout** (Layout.tsx)
  - **Header** (Header.tsx)
  - **Footer** (Footer.tsx)
  - **Page Content** (LandingPage.tsx, ChatbotPage.tsx, ReflectionPage.tsx, AboutPage.tsx, PrivacyPage.tsx, NotFoundPage.tsx)

### Backend API Flow
- **Express Server** (index.js)
  - **Chat Routes** (routes/chat.js) → **OpenAI Service** (services/openaiService.js)
  - **Reflection Routes** (routes/reflection.js) → **Airtable Service** (services/airtableService.js)
  - **Webhook Routes** (routes/webhook.js) → **Airtable Service** (services/airtableService.js)

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

## Conclusion

This index provides a comprehensive, up-to-date overview of the Sacred Healing Companion & Journey Hub codebase. Developers should refer to this document to understand the organization and purpose of each file and directory. As the codebase evolves, this index should be updated to reflect changes in the file structure and functionality.
