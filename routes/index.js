const routes = require('express').Router();

const myController = require('../controllers')

routes.get('/', (req, res, next) => {
    res.json('Addison Cox');
});

module.exports = routes;