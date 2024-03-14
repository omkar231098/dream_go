// rateLimiter.js

const rateLimit = require("express-rate-limit");

// Define the rate limiter middleware
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 2, // limit each IP to 2 requests per windowMs
  message: "Too many requests from this IP, You can add only 2 listings.",
});

module.exports = limiter;
