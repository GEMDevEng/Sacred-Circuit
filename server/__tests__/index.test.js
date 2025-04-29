import request from 'supertest';
import app from '../index.js';
import { rateLimit } from '../middleware/security.js';

// Mock dependencies
jest.mock('../middleware/security.js', () => ({
  rateLimit: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../routes/chat.js', () => {
  const express = require('express');
  const router = express.Router();
  router.post('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Chat route mock' });
  });
  return router;
});

jest.mock('../routes/reflection.js', () => {
  const express = require('express');
  const router = express.Router();
  router.post('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Reflection route mock' });
  });
  return router;
});

jest.mock('../routes/webhook.js', () => {
  const express = require('express');
  const router = express.Router();
  router.post('/typeform', (req, res) => {
    res.status(200).json({ success: true, message: 'Webhook route mock' });
  });
  return router;
});

// Mock environment variables
const originalEnv = process.env;

describe('Server', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set NODE_ENV to development for testing
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterAll(() => {
    // Restore environment
    process.env = originalEnv;
  });

  describe('Middleware Configuration', () => {
    test('applies rate limiting to API routes', () => {
      expect(rateLimit).toHaveBeenCalledWith({
        windowMs: 60 * 1000,
        maxRequests: 60
      });
    });

    test('handles JSON parsing errors', async () => {
      const response = await request(app)
        .post('/api/chat')
        .set('Content-Type', 'application/json; charset=utf-8')
        .send('{invalid json}');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Invalid JSON');
    });
  });

  describe('API Routes', () => {
    test('health check endpoint returns 200', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('message', 'Server is running');
      expect(response.body.data).toHaveProperty('timestamp');
    });

    test('chat route is accessible', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'test', healingName: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Chat route mock');
    });

    test('reflection route is accessible', async () => {
      const response = await request(app)
        .post('/api/reflection')
        .send({ healingName: 'test', content: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Reflection route mock');
    });

    test('webhook route is accessible', async () => {
      const response = await request(app)
        .post('/api/webhook/typeform')
        .send({ form_response: { answers: [], submitted_at: new Date().toISOString() } });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Webhook route mock');
    });
  });

  describe('Error Handling', () => {
    test('returns 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(404);
    });
  });
});
