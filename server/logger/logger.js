const winston = require("winston");

// Define the format for the logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create a Winston logger with the desired transports (e.g., console and file)
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
});

module.exports = logger;
