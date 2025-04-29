#!/bin/bash

# Deploy script for Sacred Healing Companion & Journey Hub

# Exit on error
set -e

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install --global vercel@latest
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one based on .env.example"
    exit 1
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Check for required environment variables
required_vars=(
    "OPENAI_API_KEY"
    "AIRTABLE_API_KEY"
    "AIRTABLE_BASE_ID"
    "MAILCHIMP_API_KEY"
    "JWT_SECRET"
    "JWT_REFRESH_SECRET"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in .env file"
        exit 1
    fi
done

# Build the project
echo "Building project..."
npm run build

# Run tests
echo "Running tests..."
npm test

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel deploy --prod \
    --env OPENAI_API_KEY=$OPENAI_API_KEY \
    --env AIRTABLE_API_KEY=$AIRTABLE_API_KEY \
    --env AIRTABLE_BASE_ID=$AIRTABLE_BASE_ID \
    --env MAILCHIMP_API_KEY=$MAILCHIMP_API_KEY \
    --env JWT_SECRET=$JWT_SECRET \
    --env JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET \
    --yes

echo "Deployment complete!"
echo "Verifying deployment..."

# Get the deployment URL
DEPLOYMENT_URL=$(vercel --prod)

# Verify the deployment
echo "Checking health endpoint..."
curl -s "$DEPLOYMENT_URL/api/health" | grep -q "ok" && echo "Health check passed!" || echo "Health check failed!"

echo "Deployment verification complete!"
echo "Visit $DEPLOYMENT_URL to see your deployed application."
