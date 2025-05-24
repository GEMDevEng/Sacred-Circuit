import logger from '../utils/logger.js';

/**
 * Middleware for logging HTTP requests
 */
export const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Log the request
  logger.http(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous',
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - start;
    
    // Log the response
    logger.logRequest(req, res, responseTime);
    
    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Middleware for logging errors
 */
export const errorLogger = (err, req, res, next) => {
  // Log the error with context
  logger.logError(err, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous',
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next(err);
};

/**
 * Middleware for logging user actions
 */
export const actionLogger = (action) => {
  return (req, res, next) => {
    // Log after the request is processed
    const originalSend = res.send;
    res.send = function(data) {
      if (res.statusCode < 400) {
        logger.logUserAction(action, req.user?.id || 'anonymous', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
        });
      }
      originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Middleware for logging security events
 */
export const securityLogger = (event) => {
  return (req, res, next) => {
    logger.logSecurityEvent(event, {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous',
    });

    next();
  };
};

export default {
  httpLogger,
  errorLogger,
  actionLogger,
  securityLogger,
};
