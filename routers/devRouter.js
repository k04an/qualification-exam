const Router = require('express').Router()
const DevController = require('../controllers/DevController')

Router.get('/', DevController.index)

module.exports = Router