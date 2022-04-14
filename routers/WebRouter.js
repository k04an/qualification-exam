const Route = require('express').Router()
const IndexController = require('../controllers/IndexController')

Route.get('/', IndexController.index)

module.exports = Route