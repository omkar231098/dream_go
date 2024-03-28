const express = require('express');
const app = express();
const swaggerJSDoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")


require('dotenv').config();
const cors = require('cors');
const loggingMiddleware = require('./logger/loggingMiddleware.js'); // Adjust the path accordingly

const authRoutes = require('./routes/auth.js');
const listingRoutes = require('./routes/listing.js');
const bookingRoutes = require('./routes/booking.js');
const userRoutes = require('./routes/user.js');
const reviewRoutes =require('./routes/review.js')
const { connection } = require('./config/db');
const logger = require('./logger/logger.js'); // Adjust the path accordingly

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Use logging middleware
app.use(loggingMiddleware);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/properties', listingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);
app.use('/review', reviewRoutes);





const options={
  definition:{
    openapi:"3.0.0",
    info:{
      title:"DreamGO Backend",
      version:"1.0.0"
    },
    servers:[
      {
        url:"http://localhost:8500"
      }
    ]
  },
  apis:[
    "./routes/*.js"
  ]
}
// specification
const swaggerSpec=swaggerJSDoc(options)

// builiding ui

app.use("/documentations",swaggerUi.serve,swaggerUi.setup(swaggerSpec))










/* MONGOOSE SETUP */
const port = process.env.PORT || 8500;

app.listen(port, async () => {
  try {
    await connection;
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('Not able to connect to MongoDB', { error: err.message });
    console.error(err);
    process.exit(1); // Exit the process with an error code
  }

  logger.info(`Server is running on port ${port}`);
});
