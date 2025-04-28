import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import chatRoutes from './routes/chat.js';
import reflectionRoutes from './routes/reflection.js';
import webhookRoutes from './routes/webhook.js';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security: Disable X-Powered-By header
app.disable('x-powered-by');

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/reflection', reflectionRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

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

  // Rate limiting for wildcard route
  const requestCounts = {};
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX = 60; // 60 requests per minute

  app.get('*', (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Initialize or clean up old entries
    requestCounts[ip] = requestCounts[ip] ? requestCounts[ip].filter(time => now - time < RATE_LIMIT_WINDOW) : [];

    // Check if rate limit exceeded
    if (requestCounts[ip].length >= RATE_LIMIT_MAX) {
      return res.status(429).send('Too many requests, please try again later.');
    }

    // Add current request timestamp
    requestCounts[ip].push(now);

    // Send the file
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
