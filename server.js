const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const router = require('./routes/index.js');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Choose port
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', router);

// Initialize MongoDB connection
mongodb.initDb((err, db) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    // Start the server
    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening on port ${port}`);
    });
  }
});
