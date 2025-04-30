# CI/CD Pipeline Documentation

## Overview

The Sacred Healing Companion & Journey Hub uses a Continuous Integration and Continuous Deployment (CI/CD) pipeline to automate testing, building, and deploying the application. The pipeline is implemented using GitHub Actions and Vercel, ensuring that code changes are thoroughly tested before being deployed to production.

## Pipeline Architecture

### Components

- **GitHub Actions**: Handles CI/CD workflow execution
- **Vercel**: Manages deployment of the application
- **Jest**: Runs unit and integration tests
- **Cypress**: Runs end-to-end tests
- **ESLint**: Performs code quality checks
- **npm**: Manages dependencies and runs scripts

### Workflow

1. **Code Changes**: Developer makes changes and pushes to GitHub
2. **CI Trigger**: GitHub Actions workflow is triggered by push or pull request
3. **Install Dependencies**: Dependencies are installed
4. **Linting**: Code is linted using ESLint
5. **Unit Tests**: Unit and integration tests are run using Jest
6. **Build**: Application is built
7. **End-to-End Tests**: End-to-end tests are run using Cypress
8. **Deployment**: If all tests pass and the branch is `main`, the application is deployed to Vercel

## GitHub Actions Workflow

The CI/CD pipeline is defined in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Generate test coverage
        run: npm run test:coverage

  deploy:
    name: Deploy
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        run: |
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }} \
            --env OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }} \
            --env AIRTABLE_API_KEY=${{ secrets.AIRTABLE_API_KEY }} \
            --env AIRTABLE_BASE_ID=${{ secrets.AIRTABLE_BASE_ID }} \
            --env MAILCHIMP_API_KEY=${{ secrets.MAILCHIMP_API_KEY }} \
            --env JWT_SECRET=${{ secrets.JWT_SECRET }} \
            --env JWT_REFRESH_SECRET=${{ secrets.JWT_REFRESH_SECRET }} \
            --yes
```

## Vercel Configuration

The Vercel deployment is configured in `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": null,

  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/routes/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Testing in the Pipeline

### Unit and Integration Tests

Unit and integration tests are run using Jest:

```bash
npm test
```

Jest is configured in `jest.config.js` for frontend tests and `jest.server.config.js` for backend tests.

### End-to-End Tests

End-to-end tests are run using Cypress:

```bash
npm run cypress:run
```

Cypress is configured in `cypress.config.js`.

### Code Quality

Code quality is checked using ESLint:

```bash
npm run lint
```

ESLint is configured in `eslint.config.js`.

## Environment Variables

The following environment variables are required for deployment:

| Variable | Description |
|----------|-------------|
| `VERCEL_TOKEN` | Vercel API token for deployment |
| `OPENAI_API_KEY` | OpenAI API key for chatbot functionality |
| `AIRTABLE_API_KEY` | Airtable API key for database operations |
| `AIRTABLE_BASE_ID` | Airtable base ID for database operations |
| `MAILCHIMP_API_KEY` | Mailchimp API key for email operations |
| `JWT_SECRET` | Secret for signing JWT access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing JWT refresh tokens |

These variables are stored as GitHub Secrets and passed to Vercel during deployment.

## Deployment Process

### Automatic Deployment

1. Changes are pushed to the `main` branch
2. GitHub Actions workflow is triggered
3. Tests are run
4. If tests pass, the application is built
5. The application is deployed to Vercel

### Manual Deployment

Manual deployment can be performed using the Vercel CLI:

```bash
vercel --prod
```

Or using the deployment script:

```bash
./scripts/deploy.sh
```

## Post-Deployment Verification

After deployment, the following checks are performed:

1. **Health Check**: The `/api/health` endpoint is checked to ensure the backend is running
2. **Frontend Check**: The frontend is checked to ensure it loads correctly
3. **Functionality Check**: Key functionality is tested to ensure it works correctly

## Rollback Process

If issues are detected after deployment, the following rollback process is used:

1. **Identify Issue**: Determine the cause of the issue
2. **Revert Commit**: Revert the problematic commit
3. **Push Revert**: Push the revert commit to the `main` branch
4. **Automatic Deployment**: The CI/CD pipeline will automatically deploy the reverted code

## Monitoring

The deployed application is monitored using:

- **Sentry**: For error tracking and monitoring
- **Vercel Analytics**: For performance monitoring
- **Custom Health Checks**: For backend health monitoring

## Future Enhancements

Planned enhancements for the CI/CD pipeline include:

- **Automated Security Scanning**: Adding security scanning to the pipeline
- **Performance Testing**: Adding performance testing to the pipeline
- **Canary Deployments**: Implementing canary deployments for safer releases
- **Automated Rollbacks**: Implementing automated rollbacks for failed deployments
- **Deployment Notifications**: Adding notifications for successful and failed deployments
