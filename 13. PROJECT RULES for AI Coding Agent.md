# PROJECT RULES for AI Coding Agent: Sacred Healing Companion & Journey Hub

## 1. Introduction

### 1.1 Purpose
This PROJECT RULES document outlines the guidelines for the AI Coding Agent to follow while assisting in the development of the Sacred Healing Companion & Journey Hub, a web-based spiritual wellness platform. These rules ensure that the code is consistent, secure, and aligned with the project’s objectives of providing a private, heart-centered space for users to engage in personalized healing journeys focused on fasting, detoxification, and emotional/spiritual growth. By adhering to these rules, the AI will produce high-quality, maintainable code that meets the needs of young adults aged 18–35 who value spirituality and privacy.

### 1.2 Scope
The document covers:
- **Coding Standards**: Rules for writing clean, consistent, and well-documented code.
- **Best Practices**: Guidelines for structuring code, handling errors, and optimizing performance.
- **Security Rules**: Measures to protect user data and ensure compliance with privacy regulations.
- **Tech Stack Guidelines**: Instructions for using the project’s technologies effectively.
- **Project-Specific Rules**: Unique requirements related to user privacy, chatbot functionality, and data collection.
- **Testing Requirements**: Standards for writing and running tests to ensure code quality.
- **Deployment and Maintenance**: Procedures for deploying the application and maintaining it post-launch.
- **References**: Links to supporting project documents for additional context.

### 1.3 Audience
This document is intended for:
- **AI Coding Agent**: To guide code generation and ensure adherence to project standards.
- **Developers**: To understand the coding expectations if collaborating with the AI.
- **Project Managers**: To monitor progress and ensure alignment with project goals.
- **Stakeholders**: To gain insight into the development process and quality standards.

## 2. Coding Standards
The AI Coding Agent must adhere to the following coding standards to ensure consistency and maintainability:

- **Language and Frameworks**:
  - Use JavaScript (ES6+) for all development.
  - Implement the frontend with [React](https://reactjs.org/) (v18.x or latest stable version).
  - Develop the backend with [Node.js](https://nodejs.org/) (v18.x or latest stable) and [Express.js](https://expressjs.com/) (v4.x or latest stable).

- **Naming Conventions**:
  - Variables and functions: camelCase (e.g., `userName`, `getUserData`).
  - React components: PascalCase (e.g., `ChatWindow`, `InputBox`).
  - Constants: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_MESSAGE_LENGTH`).
  - Files: kebab-case (e.g., `chat-window.js`, `user-service.js`).

- **Code Formatting**:
  - Indentation: 2 spaces, no tabs.
  - Line length: Maximum 100 characters to ensure readability.
  - Use semicolons to terminate statements.
  - Follow [Prettier](https://prettier.io/) formatting rules with a configuration file (`.prettierrc`).

- **Documentation**:
  - Comment complex logic or non-obvious code blocks to explain intent.
  - Use [JSDoc](https://jsdoc.app/) for all functions, methods, and React components, including parameters, return values, and descriptions.
  - Example:
    ```javascript
    /**
     * Sends a user message to the OpenAI API and returns the chatbot response.
     * @param {string} message - The user's input message.
     * @param {string} healingName - The user's chosen Healing Name.
     * @returns {Promise<string>} The chatbot's response.
     */
    async function sendChatMessage(message, healingName) {
      // Implementation
    }
    ```

- **Version Control**:
  - Write clear, descriptive commit messages following the format: `[Type]: Short description` (e.g., `feat: Add chatbot input field`, `fix: Resolve API error handling`).
  - Use branch naming conventions: `feature/<feature-name>` (e.g., `feature/chatbot`), `bugfix/<issue-name>` (e.g., `bugfix/login-error`), `chore/<task-name>` (e.g., `chore/update-dependencies`).
  - Push code to a Git repository hosted on [GitHub](https://github.com/).

- **Linting**:
  - Use [ESLint](https://eslint.org/) with the Airbnb JavaScript style guide to enforce code quality.
  - Ensure all code passes linting checks before committing, using a configuration file (`.eslintrc.json`).
  - Example `.eslintrc.json`:
    ```json
    {
      "extends": "airbnb",
      "env": {
        "browser": true,
        "node": true
      },
      "rules": {
        "react/prop-types": "off"
      }
    }
    ```

## 3. Best Practices
The AI Coding Agent should follow these best practices to ensure robust, efficient, and user-friendly code:

- **Modular Code Structure**:
  - Organize frontend code into components, hooks, and utilities (e.g., `/src/components`, `/src/hooks`, `/src/utils`).
  - Structure backend code with routes, controllers, and services (e.g., `/src/routes`, `/src/controllers`, `/src/services`).
  - Keep functions and components small and focused on a single responsibility.

- **Error Handling**:
  - Use try-catch blocks for all asynchronous operations (e.g., API calls, database queries).
  - Return user-friendly error messages without exposing sensitive information (e.g., “Something went wrong, please try again” instead of stack traces).
  - Log errors to a monitoring service (e.g., [Sentry](https://sentry.io/)) for debugging.

- **Performance Optimization**:
  - Use React’s `useMemo` and `useCallback` hooks to prevent unnecessary re-renders.
  - Minimize API calls by batching requests where possible.
  - Optimize images and assets using compressed formats like WebP.
  - Implement lazy loading for non-critical components or assets.

- **Accessibility**:
  - Ensure all interactive elements (e.g., buttons, inputs) are keyboard accessible.
  - Provide descriptive alt text for images and icons.
  - Use semantic HTML elements (e.g., `<nav>`, `<main>`, `<article>`).
  - Follow [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/) guidelines for contrast and navigation.

- **Code Reusability**:
  - Create reusable React components for common UI elements (e.g., buttons, modals).
  - Develop utility functions for repeated logic (e.g., input validation, API request wrappers).
  - Use TypeScript interfaces or PropTypes for type safety in React components.

## 4. Security Rules
Security is paramount due to the platform’s handling of sensitive user data and its commitment to user sovereignty. The AI Coding Agent must implement the following security measures:

- **Authentication**:
  - Use a secure authentication system such as [Supabase Auth](https://supabase.com/docs/guides/auth) or [Firebase Auth](https://firebase.google.com/docs/auth) for user management.
  - Implement token-based authentication with JSON Web Tokens (JWT), ensuring tokens are short-lived (e.g., 15-minute expiration) with refresh tokens.
  - Require strong passwords (minimum 12 characters, mixed case, numbers, special characters) and offer optional multi-factor authentication (MFA).

- **Authorization**:
  - Enforce role-based access control (RBAC) with roles such as `user` and `admin`.
  - Validate user roles on both frontend routing and backend API endpoints, rejecting unauthorized requests with a `403 Forbidden` response.
  - Example middleware for Express:
    ```javascript
    function restrictTo(role) {
      return (req, res, next) => {
        if (req.user.role !== role) {
          return res.status(403).json({ error: 'Access denied' });
        }
        next();
      };
    }
    ```

- **API Security**:
  - Protect all API endpoints with JWT validation using middleware.
  - Use HTTPS for all communications, redirecting HTTP requests to HTTPS.
  - Implement Cross-Origin Resource Sharing (CORS) with a strict policy (e.g., `Access-Control-Allow-Origin: [invalid url, do not cite]`).
  - Apply a Content Security Policy (CSP) header to mitigate XSS attacks (e.g., `Content-Security-Policy: default-src 'self'; script-src 'self'`).

- **Data Handling**:
  - Sanitize and validate all user inputs on both frontend and backend using libraries like [validator.js](https://github.com/validatorjs/validator.js) or [Joi](https://joi.dev/).
  - Encrypt sensitive data (e.g., emails, reflection texts) in transit using TLS 1.3 and at rest using AES-256.
  - Configure cookies with `Secure`, `HttpOnly`, and `SameSite=Strict` attributes to prevent CSRF attacks.

- **Secrets Management**:
  - Store API keys, database credentials, and tokens in environment variables using a `.env` file or [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables).
  - Never expose secrets in client-side code, logs, or error messages.
  - Use static analysis tools in CI/CD pipelines to detect hardcoded secrets.

- **Privacy Compliance**:
  - Ensure compliance with [GDPR](https://gdpr.eu/) by providing a clear privacy policy and obtaining explicit user consent for data storage.
  - Implement OpenAI’s Zero Data Retention (ZDR) option to prevent user inputs from being used in model training.
  - Allow users to delete their accounts and all associated data upon request.

- **Attack Surface Reduction**:
  - Disable unused routes and debug endpoints in production.
  - Implement rate limiting (e.g., 100 requests per minute per IP) using [express-rate-limit](https://www.npmjs.com/package/express-rate-limit).
  - Prevent open redirects by validating URLs against a whitelist.

## 5. Tech Stack Guidelines
The AI Coding Agent must use the following technologies as specified in the project’s tech stack:

- **Frontend**:
  - Use [React](https://reactjs.org/) with functional components and hooks for building the user interface.
  - Style components with [Tailwind CSS](https://tailwindcss.com/) using the specified color palette (e.g., soft blue `#6A9BD8`, warm beige `#F5F5DC`).
  - Manage state with React Context for simple cases or [Redux](https://redux.js.org/) for complex state management.
  - Handle API requests with [Axios](https://axios-http.com/) for robust HTTP communication.
  - Use [React Router](https://reactrouter.com/) for client-side routing.

- **Backend**:
  - Develop APIs with [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) using a routes-controllers-services structure.
  - Example structure:
    ```
    /src
      /routes
        chat.js
        reflection.js
      /controllers
        chatController.js
        reflectionController.js
      /services
        chatService.js
        airtableService.js
    ```
  - Use [Airtable.js](https://github.com/Airtable/airtable.js) for database operations.
  - Integrate [OpenAI’s Node.js library](https://platform.openai.com/docs/api-reference?lang=node.js) for chatbot functionality.

- **Database**:
  - Use [Airtable](https://airtable.com/) as the primary database, with tables for Users and Reflections as defined in the PRD.
  - Implement logic to filter data by Healing Name to enforce row-level security, as Airtable does not natively support RLS.
  - Example Airtable query:
    ```javascript
    base('Users').select({
      filterByFormula: `{Healing Name} = "${healingName}"`
    }).firstPage((err, records) => {
      // Handle records
    });
    ```

- **Third-Party Integrations**:
  - Integrate [Typeform](https://www.typeform.com/) for user intake forms, configuring webhooks or [Zapier](https://zapier.com/) to send data to Airtable and Mailchimp.
  - Use [Mailchimp](https://mailchimp.com/) for automated email sequences, setting up triggers for welcome, guidance, and reflection emails.
  - Configure OpenAI API with a placeholder for custom prompts (e.g., `const sacredPrompt = "/* Custom prompt to be provided */";`).

- **Hosting**:
  - Deploy both frontend and backend on [Vercel](https://vercel.com/) using serverless functions for the backend.
  - Set up continuous integration with GitHub for automated deployments.

## 6. Project-Specific Rules
The Sacred Healing Companion & Journey Hub has unique requirements that the AI Coding Agent must address:

- **Privacy and User Sovereignty**:
  - **Healing Names**: Use the Healing Name provided during onboarding for all user interactions to ensure anonymity.
  - **Consent Toggle**: Implement a UI toggle in the chatbot interface to allow users to enable or disable conversation storage. The default state is disabled, and no data should be stored without explicit consent.
  - **Data Storage**: If consent is given, store conversations temporarily (e.g., for the session duration) in memory or a secure temporary store. If consent is not given, discard all conversation data post-session.
  - **Data Deletion**: Provide an endpoint (e.g., `POST /api/delete-account`) to allow users to delete their account and all associated data, ensuring compliance with GDPR.

- **Chatbot Custom Prompts**:
  - Include a placeholder for Sacred Circuit’s custom prompts in the backend code (e.g., `const sacredPrompt = "/* Custom prompt to be provided */";`).
  - When calling the OpenAI API, prepend the custom prompt to the user’s message to ensure responses align with sacred healing principles.
  - Example API call:
    ```javascript
    const response = await openai.createCompletion({
      model: 'gpt-4o',
      prompt: `${sacredPrompt}\nUser: ${userMessage}`,
      max_tokens: 150,
      temperature: 0.7
    });
    ```

- **Data Collection**:
  - Implement reflection submission forms using Airtable, triggered by email prompts at milestones (e.g., Day 7, Day 14).
  - Ensure submissions are optional and linked to the user’s Healing Name in the Reflections table.
  - Do not collect personally identifiable information (PII) beyond the Healing Name and email, and avoid medical claims or diagnoses.
  - Example Airtable form submission:
    ```javascript
    base('Reflections').create([
      {
        fields: {
          User: userRecordId,
          'Reflection Text': reflectionText,
          Date: new Date().toISOString(),
          Milestone: milestone
        }
      }
    ], (err, records) => {
      // Handle response
    });
    ```

- **User Journey**:
  - Ensure the onboarding flow redirects users from the landing page to the Typeform intake form, followed by a welcome email with a chatbot access link.
  - Implement the 7–14 day email sequence in Mailchimp, with emails triggered by Typeform submissions or scheduled milestones.
  - Provide a support contact form or email channel for user inquiries.

## 7. Testing Requirements
The AI Coding Agent must include comprehensive testing to ensure code reliability and quality:

- **Unit Testing**:
  - Write tests for React components using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
  - Test backend functions, controllers, and services with Jest.
  - Example component test:
    ```javascript
    import { render, screen } from '@testing-library/react';
    import ChatWindow from './ChatWindow';

    test('renders chat window with input field', () => {
      render(<ChatWindow />);
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });
    ```

- **Integration Testing**:
  - Test API interactions with Airtable, OpenAI, and Mailchimp to ensure seamless data flow.
  - Validate webhook or Zapier configurations for Typeform-to-Airtable and Mailchimp integrations.
  - Example integration test:
    ```javascript
    test('POST /api/chat returns chatbot response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', healingName: 'Serenity', consent: true });
      expect(response.status).toBe(200);
      expect(response.body.response).toBeDefined();
    });
    ```

- **End-to-End Testing**:
  - Use [Cypress](https://www.cypress.io/) to simulate complete user flows, including onboarding, chatbot interaction, and reflection submission.
  - Test mobile responsiveness and cross-browser compatibility (Chrome, Firefox, Safari, Edge).
  - Example Cypress test:
    ```javascript
    describe('Onboarding Flow', () => {
      it('redirects to Typeform on button click', () => {
        cy.visit('/');
        cy.get('button').contains('Start Your Healing Journey').click();
        cy.url().should('include', 'typeform.com');
      });
    });
    ```

- **Code Coverage**:
  - Aim for at least 80% code coverage across unit and integration tests.
  - Use tools like [Istanbul](https://istanbul.js.org/) to generate coverage reports.

## 8. Deployment and Maintenance
The AI Coding Agent must prepare the application for deployment and ongoing maintenance:

- **Deployment**:
  - Deploy the frontend and backend on [Vercel](https://vercel.com/) using serverless functions for the backend.
  - Set up environment variables in the Vercel dashboard for API keys (e.g., `OPENAI_API_KEY`, `AIRTABLE_API_KEY`, `MAILCHIMP_API_KEY`).
  - Automate deployment via GitHub integration, triggering builds on pushes to the main branch.
  - Include a `.env.example` file listing required environment variables:
    ```plaintext
    OPENAI_API_KEY=
    AIRTABLE_API_KEY=
    MAILCHIMP_API_KEY=
    ```
  - Verify live application functionality post-deployment, checking all user flows.

- **Monitoring**:
  - Use Vercel’s built-in logs and analytics to monitor application performance and errors.
  - Set up error tracking with [Sentry](https://sentry.io/) to capture runtime exceptions.
  - Configure alerts for critical events (e.g., API failures, high error rates) via email or [Slack](https://slack.com/).

- **Maintenance**:
  - Regularly update dependencies to patch security vulnerabilities using tools like [Dependabot](https://dependabot.com/).
  - Implement a process for handling bug reports and feature requests, prioritizing critical issues.
  - Periodically export Airtable data for backups to prevent data loss.
  - Plan for future feature enhancements based on user feedback, such as additional chatbot functionalities or expanded email sequences.

## 9. Important Considerations
The AI Coding Agent should keep the following considerations in mind while generating code:

- **Asynchronous Operations**: Handle all API calls and database queries asynchronously using `async/await` to prevent blocking the UI or server.
- **Error Handling**: Provide user-friendly error messages for failed operations (e.g., “Unable to send message, please try again”) and log detailed errors for debugging.
- **Localization**: Design the application to be easily localizable for future expansion, using string placeholders or a library like [i18next](https://www.i18next.com/).
- **Performance**: Optimize frontend assets (e.g., images, scripts) for fast loading times, targeting page load times under 3 seconds.
- **Browser Compatibility**: Ensure the application functions correctly on major browsers (Chrome, Firefox, Safari, Edge) using tools like [BrowserStack](https://www.browserstack.com/) for testing.
- **Spiritual Aesthetic**: Apply Tailwind CSS classes to create a calming, spiritual interface, using the specified color palette and typography to enhance user experience.

## 10. References
The AI Coding Agent should refer to the following project documents for additional context and detailed requirements:
- Product Requirements Document (PRD)
- Software Requirements Specification (SRS)
- App Flow Document
- Features Results Document
- Frontend Guidelines
- Backend Structure Document
- Tech Stack Document
- Security Guidelines
- Work Breakdown Structure (WBS)

## 11. Conclusion
This PROJECT RULES document provides a comprehensive set of guidelines for the AI Coding Agent to develop the Sacred Healing Companion & Journey Hub. By following these rules, the AI will produce secure, maintainable, and user-focused code that aligns with the platform’s mission of offering a private, spiritually-aligned healing experience. The structured approach ensures consistency, quality, and adherence to project timelines, enabling the successful delivery of the MVP by June 2025.

### Key Technical Specifications
| Component         | Technology                     | Purpose                                                                 |
|-------------------|--------------------------------|-------------------------------------------------------------------------|
| Frontend          | React, Tailwind CSS, Vercel    | Builds responsive, calming UI for landing page and chatbot interface     |
| Backend           | Node.js, Express.js, Vercel    | Manages API endpoints for chatbot and reflection submissions            |
| Database          | Airtable                       | Stores user data and reflections with Healing Name-based access control  |
| AI                | OpenAI GPT-4o API              | Powers chatbot with custom prompts for spiritual guidance                |
| Forms             | Typeform                       | Collects user intake data, integrated with Airtable and Mailchimp        |
| Emails            | Mailchimp                      | Sends automated 7–14 day email sequences for guidance and reflections    |
| Security          | HTTPS, JWT, Environment Vars   | Ensures data encryption, secure authentication, and GDPR compliance      |