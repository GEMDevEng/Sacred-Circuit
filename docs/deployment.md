# Deployment Guide

This document outlines the process for deploying the Sacred Healing Companion & Journey Hub application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel](https://vercel.com/) account
2. The [Vercel CLI](https://vercel.com/docs/cli) installed
3. Access to all required API keys:
   - OpenAI API key
   - Airtable API key and Base ID
   - Mailchimp API key
   - JWT secrets

## Manual Deployment

### 1. Set Up Vercel

1. Create a new project in the Vercel dashboard
2. Connect your GitHub repository
3. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### 2. Configure Environment Variables

Add the following environment variables in the Vercel dashboard:

| Name | Description |
|------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `AIRTABLE_API_KEY` | Your Airtable API key |
| `AIRTABLE_BASE_ID` | Your Airtable base ID |
| `MAILCHIMP_API_KEY` | Your Mailchimp API key |
| `JWT_SECRET` | Secret for signing JWT access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing JWT refresh tokens |
| `NODE_ENV` | Set to `production` |

### 3. Deploy Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Automated Deployment

The project is configured with GitHub Actions for continuous deployment:

1. Push changes to the `main` branch
2. GitHub Actions will:
   - Run tests
   - Build the project
   - Deploy to Vercel if all tests pass

### Setting Up GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `AIRTABLE_API_KEY`: Your Airtable API key
   - `AIRTABLE_BASE_ID`: Your Airtable base ID
   - `MAILCHIMP_API_KEY`: Your Mailchimp API key
   - `JWT_SECRET`: Secret for signing JWT access tokens
   - `JWT_REFRESH_SECRET`: Secret for signing JWT refresh tokens

2. The workflow is defined in `.github/workflows/deploy.yml`

## Post-Deployment Verification

After deployment, verify the following:

1. **Frontend**: 
   - Visit the deployed URL
   - Check that the landing page loads correctly
   - Verify that all pages are accessible

2. **Backend**:
   - Test the `/api/health` endpoint
   - Verify that the chatbot works
   - Submit a test reflection

3. **Authentication**:
   - Test user registration
   - Test user login
   - Test protected routes

## Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Verify that all environment variables are correctly set in Vercel
   - Check for any typos in API keys

2. **Build Failures**:
   - Check the build logs in Vercel
   - Ensure all dependencies are correctly installed

3. **API Endpoint Errors**:
   - Check the function logs in Vercel
   - Verify that the API endpoints are correctly configured

### Getting Help

If you encounter issues not covered here:

1. Check the Vercel documentation
2. Review the logs in the Vercel dashboard
3. Contact the development team for assistance
