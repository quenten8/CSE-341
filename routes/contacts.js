const routes = require('express').Router();
const controller = require('../controllers');

routes.get('/contacts', controller.getContacts);

routes.get('/contacts/:id', controller.getContact);

routes.post('/contacts/add', controller.addContact);

routes.put('/contacts/change/:id', controller.changeContact);

routes.delete('/contacts/delete/:id', controller.deleteContact);

module.exports = routes;