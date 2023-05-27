"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes')(express, app);
const swaggerUi = require('swagger-ui-express');
const swaggerOutput = require('./swagger-output.json');
const db_connect_1 = __importDefault(require("./db_connect"));
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
db_connect_1.default.initDb((err, db) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
    }
    else {
        // Start the server
        app.listen(port, () => {
            console.log(`Connected to MongoDB and listening on port ${port}`);
        });
    }
});
