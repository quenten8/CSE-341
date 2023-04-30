const routes = require('express').Router();
const controller = require('../controllers');

routes.get('/contacts', controller.getContacts);

routes.get('/contacts/:id', controller.getContact);

module.exports = routes;