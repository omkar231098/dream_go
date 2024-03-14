const logger = require('./logger'); // Adjust the path accordingly

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  });

  next();
};

module.exports = loggingMiddleware;
