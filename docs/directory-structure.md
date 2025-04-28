# Directory Structure for Sacred Healing Companion & Journey Hub

## 1. Introduction

### 1.1 Purpose
This Directory Structure document outlines the organization of the codebase, assets, and documentation for the Sacred Healing Companion & Journey Hub, a web-based spiritual wellness platform. The structure is designed to support efficient development, testing, and deployment by the AI Coding Agent and development team, ensuring clarity and maintainability. It aligns with the project’s Tech Stack, Project Rules, and Implementation Plan, facilitating the creation of a secure, user-friendly MVP by June 2025 that meets the needs of young adults aged 18–35 who value spirituality and privacy.

### 1.2 Scope
The directory structure covers:
- **Frontend**: React components, hooks, utilities, and assets.
- **Backend**: Node.js/Express routes, services, and templates.
- **Testing**: Unit, integration, and end-to-end test files.
- **Configuration**: Tool configurations (e.g., ESLint, Prettier, Vercel).
- **Documentation**: Project setup, deployment, and third-party integration guides.
- **Assets**: Images, fonts, and other static resources.

The structure supports the project’s requirements, including a React frontend, Node.js backend, Airtable database, and integrations with OpenAI, Typeform, and Mailchimp.

### 1.3 Audience
This document is intended for:
- **AI Coding Agent**: To generate code and documentation in the correct locations.
- **Developers**: To navigate and maintain the codebase.
- **Project Managers**: To understand the project’s organization.
- **Stakeholders**: To gain insight into the development structure.

### 1.4 Conventions
- **File Naming**: Use kebab-case for files (e.g., `landing-page.tsx`, `chat-service.js`).
- **Folder Naming**: Use lowercase with hyphens (e.g., `src/components`, `server/routes`).
- **Code Organization**: Group related files by feature or functionality (e.g., all chatbot-related components in `src/components/chatbot`).
- **Documentation**: Store markdown files in `/docs` for easy access.
- **Version Control**: Exclude sensitive files (e.g., `.env`, `node_modules`) via `.gitignore`.

## 2. Directory Structure
The root directory is organized to separate frontend, backend, and shared resources. Below is the complete structure with descriptions of each folder and file.

```
sacred-healing-hub/
├── .github/                      # GitHub-specific configurations
│   └── workflows/                # CI/CD workflows for GitHub Actions
│       └── deploy.yml            # Vercel deployment workflow
├── cypress/                      # End-to-end testing with Cypress
│   ├── e2e/                      # End-to-end test files
│   │   ├── onboarding.cy.js      # Test for onboarding flow
│   │   ├── chatbot.cy.js         # Test for chatbot interaction
│   │   └── reflection.cy.js      # Test for reflection submission
│   ├── fixtures/                 # Test data fixtures
│   └── support/                  # Cypress custom commands and config
│       └── commands.js           # Custom Cypress commands
├── docs/                         # Project documentation
│   ├── requirements-summary.md   # Summary of PRD and SRS requirements
│   ├── typeform-setup.md         # Typeform setup instructions
│   ├── zapier-setup.md           # Zapier integration instructions
│   ├── mailchimp-setup.md        # Mailchimp email sequence setup
│   ├── deployment.md             # Vercel deployment instructions
│   ├── monitoring.md             # Monitoring setup with Sentry
│   └── update-plan.md            # Post-launch update and feedback process
├── public/                       # Static frontend assets
│   ├── favicon.ico               # Website favicon
│   ├── logo.png                  # Platform logo
│   └── images/                   # Static images for UI
│       ├── hero-bg.webp          # Hero section background
│       └── spiritual-icon.webp   # Spiritual-themed icon
├── scripts/                      # Utility scripts
│   ├── deploy.sh                 # Vercel deployment script
│   └── monitor.js                # Sentry monitoring setup script
├── server/                       # Backend code (Node.js/Express)
│   ├── routes/                   # API route handlers
│   │   ├── chat.js               # /api/chat endpoint
│   │   ├── reflection.js         # /api/reflection endpoint
│   │   └── webhook.js            # /api/webhook/typeform endpoint
│   ├── services/                 # Business logic and API integrations
│   │   ├── airtableService.js    # Airtable database operations
│   │   └── openaiService.js      # OpenAI API integration
│   ├── templates/                # Email templates
│   │   ├── welcome.html          # Welcome email template
│   │   ├── guidance.html         # Guidance email template
│   │   └── reflection.html       # Reflection invitation email template
│   └── index.js                  # Main Express server entry point
├── src/                          # Frontend code (React)
│   ├── components/               # Reusable React components
│   │   ├── chatbot/              # Chatbot-related components
│   │   │   ├── ChatbotInterface.tsx # Chatbot UI with input and consent toggle
│   │   │   └── ChatMessage.tsx   # Individual message display
│   │   ├── common/               # Shared UI components
│   │   │   ├── Button.tsx        # Reusable button component
│   │   │   └── ToggleSwitch.tsx  # Consent toggle component
│   │   └── landing/              # Landing page components
│   │       └── LandingPage.tsx   # Main landing page
│   ├── hooks/                    # Custom React hooks
│   │   ├── useChat.ts            # Hook for chatbot API interactions
│   │   └── useAuth.ts            # Hook for authentication (placeholder)
│   ├── utils/                    # Utility functions
│   │   ├── api.ts                # Axios API client configuration
│   │   └── validators.ts         # Input validation functions
│   ├── __tests__/                # Unit and integration tests
│   │   ├── components/           # Component tests
│   │   │   ├── LandingPage.test.tsx # LandingPage tests
│   │   │   └── ChatbotInterface.test.tsx # ChatbotInterface tests
│   │   ├── integration/          # Integration tests
│   │   │   ├── chatbot-integration.test.js # Chatbot API integration
│   │   │   └── reflection-integration.test.js # Reflection submission
│   │   └── utils/                # Utility tests
│   │       └── validators.test.js # Validation function tests
│   ├── App.tsx                   # Main React application entry point
│   ├── index.tsx                 # React DOM rendering
│   └── styles/                   # Global styles
│       └── global.css            # Global CSS (Tailwind imports)
├── .env.example                  # Example environment variables
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Files/folders to exclude from Git
├── .prettierrc                   # Prettier configuration
├── cypress.json                  # Cypress configuration
├── package.json                  # Node.js dependencies and scripts
├── README.md                     # Project setup and running instructions
├── tailwind.config.js            # Tailwind CSS configuration
├── trello-config.json            # Trello board configuration
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment configuration
```

## 3. Detailed Directory and File Descriptions

### 3.1 Root Directory
- **.github/workflows/deploy.yml**: Defines a GitHub Actions workflow for automated deployment to Vercel on push to the main branch.
- **.env.example**: Lists required environment variables (e.g., `OPENAI_API_KEY`, `AIRTABLE_API_KEY`) without sensitive values.
- **.eslintrc.json**: Configures ESLint with the Airbnb style guide, enforcing code quality.
- **.gitignore**: Excludes sensitive files (e.g., `.env`, `node_modules`, `.DS_Store`) from version control.
- **.prettierrc**: Configures Prettier for consistent code formatting (2-space indentation, 100-character line length).
- **cypress.json**: Configures Cypress for end-to-end testing.
- **package.json**: Lists project dependencies (e.g., React, Express, Tailwind CSS) and scripts (e.g., `start`, `test`, `build`).
- **README.md**: Provides instructions for setting up, running, and deploying the project.
- **tailwind.config.js**: Customizes Tailwind CSS with the project’s color palette (e.g., soft blue `#6A9BD8`, warm beige `#F5F5DC`).
- **trello-config.json**: Defines the Trello board structure for project management.
- **tsconfig.json**: Configures TypeScript for the React frontend.
- **vercel.json**: Configures Vercel for deploying frontend and backend, including environment variables and serverless functions.

### 3.2 /cypress
- **e2e/**: Contains Cypress end-to-end test files for user flows (onboarding, chatbot, reflection submission).
- **fixtures/**: Stores test data for mocking API responses or user inputs.
- **support/commands.js**: Defines custom Cypress commands for reusable test logic.

### 3.3 /docs
- **requirements-summary.md**: Summarizes key requirements from the PRD and SRS.
- **typeform-setup.md**: Documents Typeform form and webhook configuration.
- **zapier-setup.md**: Outlines Zapier setup for Typeform-to-Airtable/Mailchimp integration.
- **mailchimp-setup.md**: Details Mailchimp configuration for email sequences.
- **deployment.md**: Provides Vercel deployment instructions.
- **monitoring.md**: Describes monitoring setup with Sentry.
- **update-plan.md**: Outlines post-launch feedback and update processes.

### 3.4 /public
- **favicon.ico**: The website’s favicon for browser display.
- **logo.png**: The platform’s logo for branding.
- **images/**: Stores optimized images (WebP format) for the UI, such as hero backgrounds and spiritual icons.

### 3.5 /scripts
- **deploy.sh**: Automates Vercel deployment via the Vercel CLI.
- **monitor.js**: Configures Sentry for error tracking and monitoring.

### 3.6 /server
- **routes/**:
  - **chat.js**: Defines the `/api/chat` endpoint for chatbot interactions.
  - **reflection.js**: Implements the `/api/reflection` endpoint for reflection submissions.
  - **webhook.js**: Handles Typeform webhook submissions (if not using Zapier).
- **services/**:
  - **airtableService.js**: Contains functions for Airtable operations (e.g., user retrieval, reflection creation).
  - **openaiService.js**: Integrates with the OpenAI API for chatbot responses.
- **templates/**:
  - **welcome.html**: HTML template for welcome email with chatbot access link.
  - **guidance.html**: Template for guidance emails with reflection prompts.
  - **reflection.html**: Template for reflection invitation emails with Airtable form link.
- **index.js**: Main entry point for the Express server, initializing middleware and routes.

### 3.7 /src
- **components/**:
  - **chatbot/**: Houses chatbot-related components (`ChatbotInterface.tsx` for the main UI, `ChatMessage.tsx` for individual messages).
  - **common/**: Stores reusable UI components (e.g., `Button.tsx`, `ToggleSwitch.tsx`).
  - **landing/**: Contains the landing page component (`LandingPage.tsx`).
- **hooks/**:
  - **useChat.ts**: Custom hook for managing chatbot API interactions.
  - **useAuth.ts**: Placeholder hook for authentication logic.
- **utils/**:
  - **api.ts**: Configures Axios for API requests with error handling.
  - **validators.ts**: Defines input validation functions (e.g., for message text, Healing Names).
- **__tests__/**:
  - **components/**: Unit tests for React components (e.g., `LandingPage.test.tsx`).
  - **integration/**: Integration tests for API interactions (e.g., `chatbot-integration.test.js`).
  - **utils/**: Tests for utility functions (e.g., `validators.test.js`).
- **App.tsx**: Main React application component with React Router configuration.
- **index.tsx**: Entry point for rendering the React app to the DOM.
- **styles/global.css**: Imports Tailwind CSS and defines global styles.

## 4. Guidelines for AI Coding Agent
To ensure the AI Coding Agent uses the directory structure effectively, it must follow these guidelines:

- **File Placement**:
  - Place new React components in `src/components/<feature>` (e.g., `src/components/chatbot` for chatbot-related components).
  - Add backend routes in `server/routes` and services in `server/services`.
  - Store test files in `src/__tests__` for unit/integration tests and `cypress/e2e` for end-to-end tests.
  - Save documentation in `docs` as markdown files.

- **Naming Conventions**:
  - Use kebab-case for file names (e.g., `landing-page.tsx`, `chat-service.js`).
  - Name components in PascalCase (e.g., `ChatbotInterface.tsx`).
  - Use descriptive names reflecting functionality (e.g., `useChat.ts` for a chatbot hook).

- **Security Considerations**:
  - Never store sensitive data (e.g., API keys) in code files; use `.env` and Vercel environment variables.
  - Exclude `.env` from version control via `.gitignore`.
  - Ensure templates (`server/templates`) do not include hardcoded sensitive data.

- **Documentation