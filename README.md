# Sacred Healing Companion & Journey Hub

Welcome to the **Sacred Healing Companion & Journey Hub**, a web-based spiritual wellness platform designed to provide young adults aged 18–35 with a private, heart-centered space for healing and personal growth. The platform offers a chatbot for guided spiritual conversations, reflection submission forms, and automated email sequences, all tailored to support users in their fasting, detoxification, and emotional/spiritual journeys. Built with a focus on user privacy, the platform uses Healing Names for anonymity and ensures GDPR compliance.

This repository contains the codebase for the Minimum Viable Product (MVP), targeting completion by June 2025. This `README.md` provides instructions for setting up, running, testing, deploying, and contributing to the project.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Project Overview
The Sacred Healing Companion & Journey Hub empowers users to embark on personalized healing journeys through:
- **Onboarding**: Users complete a Typeform intake form to provide their Healing Name, email, and healing goals.
- **Chatbot**: A conversational interface powered by OpenAI's GPT-4o, using custom prompts for spiritual guidance, with a consent toggle for conversation storage.
- **Reflections**: Optional reflection submissions stored in Airtable, triggered by email prompts at milestones (e.g., Day 7, Day 14).
- **Email Sequences**: Automated 7–14 day email campaigns via Mailchimp, offering welcome messages, guidance, and reflection invitations.

The platform prioritizes user sovereignty, avoiding medical claims and ensuring data privacy through Zero Data Retention (ZDR) for OpenAI interactions and GDPR-compliant data handling.

## Tech Stack
The project is built with the following technologies:
- **Frontend**:
  - [React](https://reactjs.org/) (v18.x): Component-based UI.
  - [Tailwind CSS](https://tailwindcss.com/) (v3.x): Styling with a spiritual aesthetic (soft blue `#6A9BD8`, warm beige `#F5F5DC`).
  - [React Router](https://reactrouter.com/) (v6.x): Client-side routing.
  - [Axios](https://axios-http.com/) (v1.x): API requests.
  - [TypeScript](https://www.typescriptlang.org/): Type safety.
- **Backend**:
  - [Node.js](https://nodejs.org/) (v18.x): Server runtime.
  - [Express.js](https://expressjs.com/) (v4.x): API framework.
  - [Airtable.js](https://github.com/Airtable/airtable.js): Database operations.
  - [OpenAI Node.js SDK](https://platform.openai.com/docs/api-reference?lang=node.js): Chatbot integration.
- **Database**:
  - [Airtable](https://airtable.com/): Stores user data and reflections.
- **Integrations**:
  - [Typeform](https://www.typeform.com/): User intake forms.
  - [Mailchimp](https://mailchimp.com/): Email automation.
  - [Zapier](https://zapier.com/) (optional): Integration automation.
- **Hosting**:
  - [Vercel](https://vercel.com/): Deployment for frontend and backend.
- **Development Tools**:
  - [ESLint](https://eslint.org/) (Airbnb style guide): Code linting.
  - [Prettier](https://prettier.io/): Code formatting.
  - [Jest](https://jestjs.io/): Unit and integration testing.
  - [Cypress](https://www.cypress.io/): End-to-end testing.
  - [Git](https://git-scm.com/) & [GitHub](https://github.com/): Version control.

## Prerequisites
Before setting up the project, ensure you have:
- **Node.js** (v18.x or later): Install from [nodejs.org](https://nodejs.org/).
- **Git**: Install from [git-scm.com](https://git-scm.com/).
- **Vercel CLI**: Install globally with `npm install -g vercel`.
- **Text Editor**: [Visual Studio Code](https://code.visualstudio.com/) is recommended.
- **API Keys**:
  - OpenAI API key ([platform.openai.com](https://platform.openai.com/)).
  - Airtable API key and base ID ([airtable.com](https://airtable.com/)).
  - Mailchimp API key ([mailchimp.com](https://mailchimp.com/)).
- **Accounts**:
  - Vercel account for deployment.
  - Typeform account for intake forms.
  - GitHub account for repository access.

## Setup Instructions
Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GEMDevEng/Sacred-Circuit.git
   cd Sacred-Circuit
   ```

2. **Install Dependencies**:
   Install frontend and backend dependencies:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and add your API keys:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_airtable_base_id
   MAILCHIMP_API_KEY=your_mailchimp_api_key
   VERCEL_URL=https://your-vercel-app.vercel.app
   ```

4. **Set Up Airtable**:
   - Create an Airtable base with tables for `Users` and `Reflections`.
   - Configure fields as specified in the PRD (e.g., `Healing Name`, `Email`, `Reflection Text`).
   - Note the base ID and API key for `.env`.

5. **Set Up Typeform and Mailchimp** (Manual Steps):
   - Follow `docs/typeform-setup.md` to configure the intake form and webhooks/Zapier.
   - Follow `docs/mailchimp-setup.md` to set up email sequences.
   - Ensure integration data flows to Airtable and Mailchimp.

6. **Verify Setup**:
   Run the linter to ensure code quality:
   ```bash
   npm run lint
   ```

## Running the Application
To run the application locally:

1. **Start the Backend**:
   ```bash
   npm run server
   ```
   The backend runs on `http://localhost:3001` by default.

2. **Start the Frontend**:
   In a separate terminal:
   ```bash
   npm start
   ```
   The frontend runs on `http://localhost:3000`.

3. **Access the Application**:
   - Open `http://localhost:3000` in a browser.
   - Navigate to `/` for the landing page or `/chatbot` for the chatbot interface.
   - Test the onboarding flow by clicking "Start Your Healing Journey" (links to Typeform).

## Testing
The project includes comprehensive testing to ensure reliability.

1. **Unit and Integration Tests** (Jest):
   Run all tests:
   ```bash
   npm test
   ```
   Generate a coverage report:
   ```bash
   npm run test:coverage
   ```
   Tests are located in `src/__tests__`, targeting 80% coverage.

2. **End-to-End Tests** (Cypress):
   Start the application, then run:
   ```bash
   npm run cypress:open
   ```
   Tests in `cypress/e2e` cover onboarding, chatbot, and reflection flows.

3. **Linting and Formatting**:
   Check code quality:
   ```bash
   npm run lint
   npm run format
   ```

## Deployment
The application is deployed to Vercel for production.

1. **Set Up Vercel**:
   - Create a Vercel account and link it to your GitHub repository.
   - Follow `docs/deployment.md` to configure the project.

2. **Configure Environment Variables**:
   Add the same `.env` variables to the Vercel dashboard under project settings.

3. **Deploy**:
   Use the Vercel CLI:
   ```bash
   vercel --prod
   ```
   Alternatively, push to the `main` branch to trigger automatic deployment via GitHub Actions.

4. **Verify Deployment**:
   - Access the deployed app at the Vercel URL (e.g., `https://your-vercel-app.vercel.app`).
   - Test all user flows (onboarding, chatbot, reflections) in production.

## Contributing
We welcome contributions to enhance the Sacred Healing Companion & Journey Hub. Follow these steps:

1. **Fork the Repository**:
   Create a fork on GitHub and clone it locally.

2. **Create a Branch**:
   Use a descriptive branch name:
   ```bash
   git checkout -b feature/<feature-name>
   ```

3. **Follow Coding Standards**:
   - Adhere to the project rules (camelCase variables, PascalCase components, JSDoc comments).
   - Use ESLint and Prettier for code quality.
   - Write tests for new features (Jest for unit/integration, Cypress for end-to-end).

4. **Commit Changes**:
   Use clear commit messages:
   ```bash
   git commit -m "feat: Add new chatbot feature (SHC-XXX)"
   ```

5. **Push and Create a Pull Request**:
   Push your branch and open a pull request on GitHub, referencing the relevant ticket ID.

6. **Code Review**:
   Ensure your code passes linting, tests, and aligns with security guidelines before review.

## Troubleshooting
Common issues and solutions:
- **"Module not found" Error**:
  - Run `npm install` to ensure all dependencies are installed.
- **API Key Errors**:
  - Verify `.env` contains valid API keys and matches `.env.example`.
- **CORS Issues**:
  - Ensure the backend's CORS policy allows the frontend URL (`VERCEL_URL` in `.env`).
- **Test Failures**:
  - Check test files in `src/__tests__` or `cypress/e2e` for outdated mocks or selectors.
- **Deployment Fails**:
  - Confirm environment variables are set in the Vercel dashboard.
  - Review Vercel logs (`vercel logs <app-name>`) for errors.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Contact**: For questions or support, reach out to the project team.

**Happy Healing!** Let's build a transformative platform together.
