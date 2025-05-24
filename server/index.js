import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Routes
import chatRoutes from './routes/chat.js';
import reflectionRoutes from './routes/reflection.js';
import webhookRoutes from './routes/webhook.js';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';
import analyticsRoutes from './routes/analytics.js';

// Middleware
import { rateLimit, securityHeaders } from './middleware/security.js';
import { sendErrorResponse } from './utils/response-utils.js';
import csrfProtection, { handleCsrfError, getCsrfToken, refreshCsrfToken } from './middleware/csrf.js';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002 to avoid conflicts

// Security: Disable X-Powered-By header
app.disable('x-powered-by');

// Apply security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// Apply additional custom security headers
app.use(securityHeaders());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));

// Request parsing middleware
app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser()); // Parse cookies

// Global rate limiting for all API routes
app.use('/api', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60 // 60 requests per minute
}));

// Error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendErrorResponse(res, 'Invalid JSON', 400);
  }
  next(err);
});

// CSRF protection for all API routes except webhooks
app.use('/api', (req, res, next) => {
  // Skip CSRF protection for webhook routes
  if (req.path.startsWith('/webhook')) {
    return next();
  }

  // Apply CSRF protection
  csrfProtection(req, res, next);
});

// Handle CSRF errors
app.use(handleCsrfError);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reflection', reflectionRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/health', healthRoutes);

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, refreshCsrfToken, getCsrfToken);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set cache control headers for static assets
  app.use(express.static(path.join(__dirname, '../dist'), {
    maxAge: '1d', // Cache static assets for 1 day
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        // Don't cache HTML files
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Serve index.html for all other routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return sendErrorResponse(res, 'Internal server error', 500);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
