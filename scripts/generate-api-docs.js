#!/usr/bin/env node

/**
 * API Documentation Generator
 * 
 * This script automatically generates comprehensive API documentation
 * by analyzing the server routes and creating interactive documentation.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Documentation structure
const apiDocs = {
  info: {
    title: 'Sacred Healing Hub API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for the Sacred Healing Hub application',
    contact: {
      name: 'Sacred Healing Hub Team',
      email: 'support@sacredhealinghub.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://sacred-healing-hub.vercel.app',
      description: 'Production server',
    },
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Define API endpoints with detailed documentation
const endpoints = [
  {
    path: '/api/health',
    method: 'GET',
    summary: 'Health Check',
    description: 'Check the health status of the API server',
    tags: ['System'],
    responses: {
      200: {
        description: 'Server is healthy',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', format: 'date-time' },
                uptime: { type: 'number', description: 'Server uptime in seconds' },
              },
            },
          },
        },
      },
    },
  },
  {
    path: '/api/auth/register',
    method: 'POST',
    summary: 'User Registration',
    description: 'Register a new user account',
    tags: ['Authentication'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'healingName'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
                description: 'User email address',
              },
              password: {
                type: 'string',
                minLength: 8,
                example: 'securePassword123',
                description: 'User password (minimum 8 characters)',
              },
              healingName: {
                type: 'string',
                minLength: 2,
                maxLength: 50,
                example: 'Healing Soul',
                description: 'User healing name for the platform',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AuthResponse',
            },
          },
        },
      },
      400: {
        description: 'Invalid input data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      409: {
        description: 'User already exists',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
  {
    path: '/api/auth/login',
    method: 'POST',
    summary: 'User Login',
    description: 'Authenticate user and return access token',
    tags: ['Authentication'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
              },
              password: {
                type: 'string',
                example: 'securePassword123',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AuthResponse',
            },
          },
        },
      },
      401: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
  {
    path: '/api/auth/logout',
    method: 'POST',
    summary: 'User Logout',
    description: 'Logout user and invalidate token',
    tags: ['Authentication'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Logout successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Logged out successfully' },
              },
            },
          },
        },
      },
    },
  },
  {
    path: '/api/auth/me',
    method: 'GET',
    summary: 'Get Current User',
    description: 'Get current authenticated user information',
    tags: ['Authentication'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'User information retrieved successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
  {
    path: '/api/chat',
    method: 'POST',
    summary: 'Send Chat Message',
    description: 'Send a message to the AI chatbot and receive a response',
    tags: ['Chat'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['message', 'healingName'],
            properties: {
              message: {
                type: 'string',
                minLength: 1,
                maxLength: 1000,
                example: 'I am feeling anxious today. Can you help me?',
                description: 'User message to the chatbot',
              },
              healingName: {
                type: 'string',
                example: 'Healing Soul',
                description: 'User healing name for personalized responses',
              },
              conversationId: {
                type: 'string',
                example: 'conv_123456',
                description: 'Optional conversation ID for context',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Chat response generated successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChatResponse',
            },
          },
        },
      },
      400: {
        description: 'Invalid input data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      429: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
  {
    path: '/api/reflection',
    method: 'POST',
    summary: 'Submit Reflection',
    description: 'Submit a personal reflection for a specific milestone',
    tags: ['Reflection'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['content', 'milestone'],
            properties: {
              content: {
                type: 'string',
                minLength: 10,
                maxLength: 5000,
                example: 'Today I reflected on my journey and felt grateful for the progress I have made.',
                description: 'Reflection content',
              },
              milestone: {
                type: 'string',
                enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
                example: 'daily',
                description: 'Reflection milestone type',
              },
              mood: {
                type: 'string',
                enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'],
                example: 'positive',
                description: 'User mood during reflection',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                example: ['gratitude', 'progress', 'healing'],
                description: 'Optional tags for categorizing the reflection',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Reflection submitted successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ReflectionResponse',
            },
          },
        },
      },
      400: {
        description: 'Invalid input data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
  {
    path: '/api/reflection/history',
    method: 'GET',
    summary: 'Get Reflection History',
    description: 'Retrieve user reflection history with optional filtering',
    tags: ['Reflection'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'milestone',
        in: 'query',
        description: 'Filter by milestone type',
        schema: {
          type: 'string',
          enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        },
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Number of reflections to return',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 20,
        },
      },
      {
        name: 'offset',
        in: 'query',
        description: 'Number of reflections to skip',
        schema: {
          type: 'integer',
          minimum: 0,
          default: 0,
        },
      },
    ],
    responses: {
      200: {
        description: 'Reflection history retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Reflection' },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 50 },
                    limit: { type: 'integer', example: 20 },
                    offset: { type: 'integer', example: 0 },
                    hasMore: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    path: '/api/feedback',
    method: 'POST',
    summary: 'Submit Feedback',
    description: 'Submit user feedback about the application',
    tags: ['Feedback'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['type', 'message'],
            properties: {
              type: {
                type: 'string',
                enum: ['bug', 'feature', 'improvement', 'general'],
                example: 'improvement',
                description: 'Type of feedback',
              },
              message: {
                type: 'string',
                minLength: 10,
                maxLength: 1000,
                example: 'The chat interface could be more intuitive.',
                description: 'Feedback message',
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
                description: 'Optional email for follow-up',
              },
              rating: {
                type: 'integer',
                minimum: 1,
                maximum: 5,
                example: 4,
                description: 'Optional rating (1-5 stars)',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Feedback submitted successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Thank you for your feedback!' },
                id: { type: 'string', example: 'feedback_123456' },
              },
            },
          },
        },
      },
    },
  },
];

// Define reusable schemas
const schemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'user_123456' },
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      healingName: { type: 'string', example: 'Healing Soul' },
      role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
      isEmailVerified: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      message: { type: 'string', example: 'Authentication successful' },
    },
  },
  ChatResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          response: { type: 'string', example: 'I understand you are feeling anxious. Here are some techniques that might help...' },
          conversationId: { type: 'string', example: 'conv_123456' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  Reflection: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'reflection_123456' },
      content: { type: 'string', example: 'Today I reflected on my journey...' },
      milestone: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
      mood: { type: 'string', enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'] },
      tags: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  ReflectionResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { $ref: '#/components/schemas/Reflection' },
      message: { type: 'string', example: 'Reflection submitted successfully' },
    },
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'VALIDATION_ERROR' },
          message: { type: 'string', example: 'Invalid input data' },
          details: { type: 'object', description: 'Additional error details' },
        },
      },
    },
  },
};

/**
 * Generate OpenAPI specification
 */
const generateOpenAPISpec = () => {
  // Add schemas to the API docs
  apiDocs.components.schemas = schemas;

  // Add endpoints to the API docs
  endpoints.forEach(endpoint => {
    const { path, method, ...spec } = endpoint;
    
    if (!apiDocs.paths[path]) {
      apiDocs.paths[path] = {};
    }
    
    apiDocs.paths[path][method.toLowerCase()] = spec;
  });

  return apiDocs;
};

/**
 * Generate HTML documentation
 */
const generateHTMLDocs = (openApiSpec) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${openApiSpec.info.title} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #667eea;
            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .swagger-ui .topbar .download-url-wrapper {
            display: none;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: './api-spec.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Add any request interceptors here
                    return request;
                },
                responseInterceptor: function(response) {
                    // Add any response interceptors here
                    return response;
                }
            });
        };
    </script>
</body>
</html>
  `;
};

/**
 * Generate Markdown documentation
 */
const generateMarkdownDocs = (openApiSpec) => {
  let markdown = `# ${openApiSpec.info.title}\n\n`;
  markdown += `${openApiSpec.info.description}\n\n`;
  markdown += `**Version:** ${openApiSpec.info.version}\n\n`;
  
  if (openApiSpec.info.contact) {
    markdown += `**Contact:** ${openApiSpec.info.contact.email}\n\n`;
  }

  markdown += `## Servers\n\n`;
  openApiSpec.servers.forEach(server => {
    markdown += `- **${server.description}:** ${server.url}\n`;
  });
  markdown += `\n`;

  markdown += `## Authentication\n\n`;
  markdown += `This API uses Bearer token authentication. Include the token in the Authorization header:\n\n`;
  markdown += `\`\`\`\nAuthorization: Bearer <your-token>\n\`\`\`\n\n`;

  // Group endpoints by tags
  const endpointsByTag = {};
  endpoints.forEach(endpoint => {
    const tag = endpoint.tags?.[0] || 'Other';
    if (!endpointsByTag[tag]) {
      endpointsByTag[tag] = [];
    }
    endpointsByTag[tag].push(endpoint);
  });

  Object.keys(endpointsByTag).forEach(tag => {
    markdown += `## ${tag}\n\n`;
    
    endpointsByTag[tag].forEach(endpoint => {
      markdown += `### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
      markdown += `${endpoint.description}\n\n`;
      
      if (endpoint.security) {
        markdown += `**Authentication required:** Yes\n\n`;
      }

      if (endpoint.parameters) {
        markdown += `**Parameters:**\n\n`;
        endpoint.parameters.forEach(param => {
          markdown += `- **${param.name}** (${param.in}): ${param.description}\n`;
        });
        markdown += `\n`;
      }

      if (endpoint.requestBody) {
        markdown += `**Request Body:**\n\n`;
        markdown += `\`\`\`json\n`;
        markdown += JSON.stringify(endpoint.requestBody.content['application/json'].schema, null, 2);
        markdown += `\n\`\`\`\n\n`;
      }

      markdown += `**Responses:**\n\n`;
      Object.keys(endpoint.responses).forEach(statusCode => {
        const response = endpoint.responses[statusCode];
        markdown += `- **${statusCode}:** ${response.description}\n`;
      });
      markdown += `\n`;
    });
  });

  return markdown;
};

/**
 * Generate API documentation files
 */
const generateAPIDocs = async () => {
  console.log('📚 Generating API documentation...');

  try {
    // Create docs directory
    const docsDir = path.join(__dirname, '../docs/api');
    await fs.mkdir(docsDir, { recursive: true });

    // Generate OpenAPI specification
    const openApiSpec = generateOpenAPISpec();

    // Save OpenAPI spec as JSON
    const specPath = path.join(docsDir, 'api-spec.json');
    await fs.writeFile(specPath, JSON.stringify(openApiSpec, null, 2));
    console.log(`✅ OpenAPI specification saved to: ${specPath}`);

    // Generate HTML documentation
    const htmlDocs = generateHTMLDocs(openApiSpec);
    const htmlPath = path.join(docsDir, 'index.html');
    await fs.writeFile(htmlPath, htmlDocs);
    console.log(`✅ HTML documentation saved to: ${htmlPath}`);

    // Generate Markdown documentation
    const markdownDocs = generateMarkdownDocs(openApiSpec);
    const markdownPath = path.join(docsDir, 'README.md');
    await fs.writeFile(markdownPath, markdownDocs);
    console.log(`✅ Markdown documentation saved to: ${markdownPath}`);

    // Generate Postman collection
    const postmanCollection = generatePostmanCollection(openApiSpec);
    const postmanPath = path.join(docsDir, 'postman-collection.json');
    await fs.writeFile(postmanPath, JSON.stringify(postmanCollection, null, 2));
    console.log(`✅ Postman collection saved to: ${postmanPath}`);

    console.log('\n🎉 API documentation generated successfully!');
    console.log(`📖 View documentation at: file://${htmlPath}`);

  } catch (error) {
    console.error('❌ Failed to generate API documentation:', error);
    process.exit(1);
  }
};

/**
 * Generate Postman collection
 */
const generatePostmanCollection = (openApiSpec) => {
  const collection = {
    info: {
      name: openApiSpec.info.title,
      description: openApiSpec.info.description,
      version: openApiSpec.info.version,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{authToken}}',
          type: 'string',
        },
      ],
    },
    variable: [
      {
        key: 'baseUrl',
        value: openApiSpec.servers[0].url,
        type: 'string',
      },
      {
        key: 'authToken',
        value: '',
        type: 'string',
      },
    ],
    item: [],
  };

  // Group endpoints by tags
  const endpointsByTag = {};
  endpoints.forEach(endpoint => {
    const tag = endpoint.tags?.[0] || 'Other';
    if (!endpointsByTag[tag]) {
      endpointsByTag[tag] = [];
    }
    endpointsByTag[tag].push(endpoint);
  });

  Object.keys(endpointsByTag).forEach(tag => {
    const folder = {
      name: tag,
      item: [],
    };

    endpointsByTag[tag].forEach(endpoint => {
      const request = {
        name: endpoint.summary,
        request: {
          method: endpoint.method.toUpperCase(),
          header: [
            {
              key: 'Content-Type',
              value: 'application/json',
              type: 'text',
            },
          ],
          url: {
            raw: `{{baseUrl}}${endpoint.path}`,
            host: ['{{baseUrl}}'],
            path: endpoint.path.split('/').filter(p => p),
          },
        },
        response: [],
      };

      // Add authentication if required
      if (endpoint.security) {
        request.request.auth = {
          type: 'bearer',
          bearer: [
            {
              key: 'token',
              value: '{{authToken}}',
              type: 'string',
            },
          ],
        };
      }

      // Add request body if present
      if (endpoint.requestBody) {
        const schema = endpoint.requestBody.content['application/json'].schema;
        const exampleBody = generateExampleFromSchema(schema);
        request.request.body = {
          mode: 'raw',
          raw: JSON.stringify(exampleBody, null, 2),
          options: {
            raw: {
              language: 'json',
            },
          },
        };
      }

      folder.item.push(request);
    });

    collection.item.push(folder);
  });

  return collection;
};

/**
 * Generate example data from schema
 */
const generateExampleFromSchema = (schema) => {
  if (schema.type === 'object' && schema.properties) {
    const example = {};
    Object.keys(schema.properties).forEach(key => {
      const prop = schema.properties[key];
      if (prop.example !== undefined) {
        example[key] = prop.example;
      } else if (prop.type === 'string') {
        example[key] = prop.format === 'email' ? 'user@example.com' : 'example string';
      } else if (prop.type === 'number' || prop.type === 'integer') {
        example[key] = 123;
      } else if (prop.type === 'boolean') {
        example[key] = true;
      } else if (prop.type === 'array') {
        example[key] = ['example'];
      }
    });
    return example;
  }
  return {};
};

// Run the documentation generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAPIDocs().catch(console.error);
}

export {
  generateAPIDocs,
  generateOpenAPISpec,
  generateHTMLDocs,
  generateMarkdownDocs,
  generatePostmanCollection,
};
