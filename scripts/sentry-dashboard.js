/**
 * Script to set up Sentry dashboards and alerts
 *
 * This script uses the Sentry API to configure dashboards and alerts
 * Run with: node scripts/sentry-dashboard.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN;
const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;

if (!SENTRY_API_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
  console.error('Missing required environment variables for Sentry configuration');
  process.exit(1);
}

const SENTRY_API_URL = `https://sentry.io/api/0/organizations/${SENTRY_ORG}`;

/**
 * Make a request to the Sentry API
 */
async function sentryRequest(endpoint, method = 'GET', data = null) {
  const url = `${SENTRY_API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${SENTRY_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sentry API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making Sentry API request to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Create a dashboard for monitoring
 */
async function createDashboard() {
  const dashboard = {
    title: 'Sacred Healing Hub - Main Dashboard',
    widgets: [
      // Error Monitoring Section
      {
        title: 'Error Count by Page',
        displayType: 'line',
        interval: '1h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Error Count',
            fields: ['count()'],
            conditions: `event.type:error project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['transaction']
          }
        ],
        layout: { x: 0, y: 0, w: 2, h: 1, minH: 1, minW: 1 }
      },
      {
        title: 'Error Breakdown by Type',
        displayType: 'pie',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Error Types',
            fields: ['count()', 'error.type'],
            conditions: `event.type:error project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['error.type']
          }
        ],
        layout: { x: 2, y: 0, w: 2, h: 1, minH: 1, minW: 1 }
      },

      // Performance Monitoring Section
      {
        title: 'Page Load Performance',
        displayType: 'line',
        interval: '1h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Page Load Time',
            fields: ['avg(transaction.duration)'],
            conditions: `event.type:transaction project:${SENTRY_PROJECT}`,
            orderby: '-avg(transaction.duration)',
            aggregates: ['avg(transaction.duration)'],
            columns: ['transaction']
          }
        ],
        layout: { x: 0, y: 1, w: 2, h: 1, minH: 1, minW: 1 }
      },
      {
        title: 'API Response Times',
        displayType: 'bar',
        interval: '1h',
        widgetType: 'discover',
        queries: [
          {
            name: 'API Response Time',
            fields: ['avg(transaction.duration)', 'transaction'],
            conditions: `event.type:transaction transaction:/api/* project:${SENTRY_PROJECT}`,
            orderby: '-avg(transaction.duration)',
            aggregates: ['avg(transaction.duration)'],
            columns: ['transaction']
          }
        ],
        layout: { x: 2, y: 1, w: 2, h: 1, minH: 1, minW: 1 }
      },

      // User Impact Section
      {
        title: 'Users Affected by Errors',
        displayType: 'big_number',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Affected Users',
            fields: ['count_unique(user)'],
            conditions: `event.type:error project:${SENTRY_PROJECT}`,
            aggregates: ['count_unique(user)']
          }
        ],
        layout: { x: 0, y: 2, w: 1, h: 1, minH: 1, minW: 1 }
      },
      {
        title: 'User Satisfaction Score',
        displayType: 'big_number',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Apdex Score',
            fields: ['apdex(transaction.duration, 300)'],
            conditions: `event.type:transaction project:${SENTRY_PROJECT}`,
            aggregates: ['apdex(transaction.duration, 300)']
          }
        ],
        layout: { x: 1, y: 2, w: 1, h: 1, minH: 1, minW: 1 }
      },

      // API and Backend Section
      {
        title: 'API Errors',
        displayType: 'table',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'API Errors',
            fields: ['title', 'count()'],
            conditions: `event.type:error tags[transaction]:api* project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['title']
          }
        ],
        layout: { x: 0, y: 3, w: 2, h: 1, minH: 1, minW: 1 }
      },
      {
        title: 'Server Errors by Endpoint',
        displayType: 'table',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Server Errors',
            fields: ['transaction', 'count()'],
            conditions: `event.type:error tags[level]:error project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['transaction']
          }
        ],
        layout: { x: 2, y: 3, w: 2, h: 1, minH: 1, minW: 1 }
      },

      // Feature Usage Section
      {
        title: 'Feature Usage',
        displayType: 'bar',
        interval: '7d',
        widgetType: 'discover',
        queries: [
          {
            name: 'Feature Usage',
            fields: ['count()', 'transaction'],
            conditions: `event.type:transaction project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['transaction']
          }
        ],
        layout: { x: 0, y: 4, w: 4, h: 1, minH: 1, minW: 1 }
      },

      // Feedback Monitoring
      {
        title: 'Feedback Submissions',
        displayType: 'line',
        interval: '24h',
        widgetType: 'discover',
        queries: [
          {
            name: 'Feedback Count',
            fields: ['count()'],
            conditions: `event.type:transaction transaction:/api/feedback project:${SENTRY_PROJECT}`,
            orderby: 'time',
            aggregates: ['count()'],
            columns: ['time']
          }
        ],
        layout: { x: 0, y: 5, w: 2, h: 1, minH: 1, minW: 1 }
      },
      {
        title: 'Feedback Types',
        displayType: 'pie',
        interval: '30d',
        widgetType: 'discover',
        queries: [
          {
            name: 'Feedback Types',
            fields: ['count()', 'tags[feedback.type]'],
            conditions: `event.type:transaction transaction:/api/feedback project:${SENTRY_PROJECT}`,
            orderby: '-count',
            aggregates: ['count()'],
            columns: ['tags[feedback.type]']
          }
        ],
        layout: { x: 2, y: 5, w: 2, h: 1, minH: 1, minW: 1 }
      }
    ]
  };

  try {
    const result = await sentryRequest('/dashboards/', 'POST', dashboard);
    console.log('Dashboard created successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to create dashboard:', error);
    throw error;
  }
}

/**
 * Create alert rules
 */
async function createAlertRules() {
  // Get the project ID
  const projects = await sentryRequest('/projects/');
  const project = projects.find(p => p.slug === SENTRY_PROJECT);

  if (!project) {
    throw new Error(`Project ${SENTRY_PROJECT} not found`);
  }

  const projectId = project.id;

  // Create alert for high error rate
  const highErrorRateAlert = {
    name: 'High Error Rate Alert',
    owner: `project:${projectId}`,
    dataset: 'events',
    query: 'event.type:error',
    aggregate: 'count()',
    timeWindow: 60, // 1 hour
    triggers: [
      {
        label: 'critical',
        alertThreshold: 100,
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          },
          {
            type: 'slack',
            targetIdentifier: 'SLACK_CHANNEL_ID', // Replace with actual Slack channel ID
            integrationId: 'SLACK_INTEGRATION_ID' // Replace with actual Slack integration ID
          }
        ]
      },
      {
        label: 'warning',
        alertThreshold: 50,
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      }
    ]
  };

  // Create alert for slow page loads
  const slowPageLoadAlert = {
    name: 'Slow Page Load Alert',
    owner: `project:${projectId}`,
    dataset: 'transactions',
    query: 'event.type:transaction transaction:/chatbot',
    aggregate: 'avg(transaction.duration)',
    timeWindow: 60, // 1 hour
    triggers: [
      {
        label: 'critical',
        alertThreshold: 3000, // 3 seconds
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      },
      {
        label: 'warning',
        alertThreshold: 2000, // 2 seconds
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      }
    ]
  };

  // Create alert for API errors
  const apiErrorAlert = {
    name: 'API Error Alert',
    owner: `project:${projectId}`,
    dataset: 'events',
    query: 'event.type:error tags[transaction]:api*',
    aggregate: 'count()',
    timeWindow: 30, // 30 minutes
    triggers: [
      {
        label: 'critical',
        alertThreshold: 20,
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          },
          {
            type: 'slack',
            targetIdentifier: 'SLACK_CHANNEL_ID', // Replace with actual Slack channel ID
            integrationId: 'SLACK_INTEGRATION_ID' // Replace with actual Slack integration ID
          }
        ]
      },
      {
        label: 'warning',
        alertThreshold: 10,
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      }
    ]
  };

  // Create alert for user-affecting errors
  const userAffectingErrorAlert = {
    name: 'User-Affecting Error Alert',
    owner: `project:${projectId}`,
    dataset: 'events',
    query: 'event.type:error !tags[handled]:true',
    aggregate: 'count_unique(user)',
    timeWindow: 60, // 1 hour
    triggers: [
      {
        label: 'critical',
        alertThreshold: 10, // 10 unique users affected
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          },
          {
            type: 'slack',
            targetIdentifier: 'SLACK_CHANNEL_ID', // Replace with actual Slack channel ID
            integrationId: 'SLACK_INTEGRATION_ID' // Replace with actual Slack integration ID
          }
        ]
      },
      {
        label: 'warning',
        alertThreshold: 5, // 5 unique users affected
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      }
    ]
  };

  // Create alert for authentication failures
  const authFailureAlert = {
    name: 'Authentication Failure Alert',
    owner: `project:${projectId}`,
    dataset: 'events',
    query: 'event.type:error tags[transaction]:/api/auth* message:*unauthorized*',
    aggregate: 'count()',
    timeWindow: 30, // 30 minutes
    triggers: [
      {
        label: 'critical',
        alertThreshold: 50, // 50 auth failures in 30 minutes could indicate an attack
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          },
          {
            type: 'slack',
            targetIdentifier: 'SLACK_CHANNEL_ID', // Replace with actual Slack channel ID
            integrationId: 'SLACK_INTEGRATION_ID' // Replace with actual Slack integration ID
          }
        ]
      },
      {
        label: 'warning',
        alertThreshold: 20,
        actions: [
          {
            type: 'email',
            targetType: 'team',
            targetIdentifier: project.teams[0].id
          }
        ]
      }
    ]
  };

  try {
    const errorRateResult = await sentryRequest('/alert-rules/', 'POST', highErrorRateAlert);
    console.log('High error rate alert created successfully:', errorRateResult.id);

    const pageLoadResult = await sentryRequest('/alert-rules/', 'POST', slowPageLoadAlert);
    console.log('Slow page load alert created successfully:', pageLoadResult.id);

    const apiErrorResult = await sentryRequest('/alert-rules/', 'POST', apiErrorAlert);
    console.log('API error alert created successfully:', apiErrorResult.id);

    const userAffectingResult = await sentryRequest('/alert-rules/', 'POST', userAffectingErrorAlert);
    console.log('User-affecting error alert created successfully:', userAffectingResult.id);

    const authFailureResult = await sentryRequest('/alert-rules/', 'POST', authFailureAlert);
    console.log('Authentication failure alert created successfully:', authFailureResult.id);

    return {
      errorRateAlert: errorRateResult,
      pageLoadAlert: pageLoadResult,
      apiErrorAlert: apiErrorResult,
      userAffectingAlert: userAffectingResult,
      authFailureAlert: authFailureResult
    };
  } catch (error) {
    console.error('Failed to create alert rules:', error);
    throw error;
  }
}

/**
 * Main function to set up Sentry monitoring
 */
async function setupSentryMonitoring() {
  try {
    console.log('Setting up Sentry monitoring...');

    // Create dashboard
    const dashboard = await createDashboard();
    console.log(`Dashboard created: ${dashboard.title}`);

    // Create alert rules
    const alerts = await createAlertRules();
    console.log(`Created ${Object.keys(alerts).length} alert rules`);

    console.log('Sentry monitoring setup complete!');
  } catch (error) {
    console.error('Failed to set up Sentry monitoring:', error);
    process.exit(1);
  }
}

// Run the setup
setupSentryMonitoring();
