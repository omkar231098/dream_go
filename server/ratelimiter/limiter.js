// rateLimiter.js

const rateLimit = require("express-rate-limit");

// Define the rate limiter middleware
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 1, // limit each IP to 1 requests per windowMs
  
});

module.exports = limiter;
