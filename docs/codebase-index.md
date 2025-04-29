# Sacred Healing Companion & Journey Hub - Codebase Index

## Introduction
This document provides a comprehensive index of the Sacred Healing Companion & Journey Hub codebase, organized by component type and functionality. It serves as a reference guide for developers to quickly locate and understand the purpose of each file in the project.

## Directory Structure Overview
```
sacred-healing-hub/
├── docs/                         # Project documentation
├── public/                       # Static frontend assets
├── server/                       # Backend code (Node.js/Express)
│   ├── routes/                   # API route handlers
│   ├── services/                 # Business logic and API integrations
│   └── templates/                # Email templates
├── src/                          # Frontend code (React)
│   ├── components/               # Reusable React components
│   │   ├── chatbot/              # Chatbot-related components
│   │   ├── common/               # Shared UI components
│   │   └── landing/              # Landing page components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── __tests__/                # Unit and integration tests
│   └── styles/                   # Global styles
```

## Backend Files

### Server Configuration
- **server/index.js**: Main Express server entry point that configures middleware, routes, and starts the server.

### API Routes
- **server/routes/chat.js**: Handles API endpoints for chatbot interactions.
- **server/routes/reflection.js**: Manages API endpoints for user reflection submissions.
- **server/routes/webhook.js**: Processes webhook callbacks from Typeform for user onboarding.

### Services
- **server/services/airtableService.js**: Provides functions for interacting with Airtable database (users and reflections).
- **server/services/openaiService.js**: Integrates with OpenAI API for chatbot functionality with spiritual guidance prompts.

### Email Templates
- **server/templates/welcome.html**: HTML template for welcome emails sent to new users.
- **server/templates/guidance.html**: HTML template for guidance emails sent during the user journey.
- **server/templates/reflection.html**: HTML template for emails prompting users to submit reflections.

## Frontend Files

### Core Application
- **src/App.tsx**: Main React application component with routing configuration.
- **src/main.tsx**: Entry point for the React application that renders the App component.

### Components

#### Chatbot Components
- **src/components/chatbot/ChatbotPage.tsx**: Main page component for the chatbot interface.

#### Common Components
- **src/components/common/Button.tsx**: Reusable button component with consistent styling.
- **src/components/common/Footer.tsx**: Footer component used across all pages.
- **src/components/common/Header.tsx**: Header component with navigation links.
- **src/components/common/Layout.tsx**: Layout wrapper component that includes header and footer.
- **src/components/common/PageTransition.tsx**: Component for page transition animations.

#### Landing Page Components
- **src/components/landing/AboutPage.tsx**: About page with information about the platform.
- **src/components/landing/LandingPage.tsx**: Main landing page component.
- **src/components/landing/NotFoundPage.tsx**: 404 error page component.
- **src/components/landing/PrivacyPage.tsx**: Privacy policy page component.
- **src/components/landing/ReflectionPage.tsx**: Page for users to submit reflections.

### Utilities
- **src/utils/api.ts**: Axios configuration and API request utilities.

### Tests
- **src/__tests__/basic.test.ts**: Basic test setup verification.
- **src/__tests__/components/ChatbotPage.test.tsx**: Tests for the ChatbotPage component.
- **src/__tests__/components/ReflectionPage.test.tsx**: Tests for the ReflectionPage component.
- **src/__tests__/utils/api.test.ts**: Tests for API utility functions.

### Styles
- **src/styles/global.css**: Global CSS styles and Tailwind CSS imports.

## Configuration Files
- **eslint.config.js**: ESLint configuration for code linting.
- **jest.config.js**: Jest configuration for testing.
- **postcss.config.js**: PostCSS configuration for CSS processing.
- **tailwind.config.js**: Tailwind CSS configuration with custom theme settings.
- **vite.config.ts**: Vite configuration for the frontend build process.
- **package.json**: Project dependencies and scripts.

## Documentation Files
- **docs/app-flow.md**: Documents the user flow through the application.
- **docs/backend-structure.md**: Details the backend architecture and components.
- **docs/design-system.md**: Describes the design system and UI components.
- **docs/directory-structure.md**: Outlines the project's directory organization.
- **docs/features-results.md**: Lists features and expected outcomes.
- **docs/frontend-guidelines.md**: Guidelines for frontend development.
- **docs/implementation-plan.md**: Plan for implementing the project.
- **docs/product-requirements.md**: Product requirements document.
- **docs/project-rules.md**: Rules and standards for the project.
- **docs/security-guidelines.md**: Security best practices for the project.
- **docs/tech-stack.md**: Details of the technology stack used.

## File Relationships

### Frontend Component Hierarchy
- **Layout** (Layout.tsx)
  - **Header** (Header.tsx)
  - **Page Content** (Various page components)
    - **LandingPage** (LandingPage.tsx)
    - **ChatbotPage** (ChatbotPage.tsx)
    - **ReflectionPage** (ReflectionPage.tsx)
    - **AboutPage** (AboutPage.tsx)
    - **PrivacyPage** (PrivacyPage.tsx)
    - **NotFoundPage** (NotFoundPage.tsx)
  - **Footer** (Footer.tsx)

### Backend API Flow
- **Express Server** (index.js)
  - **Chat Routes** (routes/chat.js)
    - Uses **OpenAI Service** (services/openaiService.js)
  - **Reflection Routes** (routes/reflection.js)
    - Uses **Airtable Service** (services/airtableService.js)
  - **Webhook Routes** (routes/webhook.js)
    - Uses **Airtable Service** (services/airtableService.js)

## Conclusion
This index provides a comprehensive overview of the Sacred Healing Companion & Journey Hub codebase. Developers should refer to this document to understand the organization and purpose of each file in the project. As the codebase evolves, this index should be updated to reflect changes in the file structure and functionality.
