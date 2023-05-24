"use strict";
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'My API',
        description: 'Description',
        version: '1.0.0',
    },
    host: 'recipes-n32s.onrender.com',
    schemes: ['https'],
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
        bearerAuth: {},
    },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.ts', './routes.ts'];
/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);
