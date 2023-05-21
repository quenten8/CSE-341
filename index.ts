const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db_connect');
const app = express();
const routes = require('./routes')(express, app);
const swaggerUi = require('swagger-ui-express');
const swaggerOutput = require('./swagger-output.json');

// Choose port
const port = Number(process.env.PORT) || 8080;

// Middleware
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Routes
app.use('/', routes);

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