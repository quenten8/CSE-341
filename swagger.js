const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'My API',
      description: 'Description',
      version: '1.0.0',
    },
    host: 'cse341-6g62.onrender.com',
    schemes: ['https'],
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
      },
    },
  };

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js', './routes/index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);