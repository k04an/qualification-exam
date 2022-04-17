const Route = require('express').Router()
const ModelController = require('../controllers/ModelController')

Route.get('/', ModelController.index)
Route.get('/details', ModelController.details)
Route.post('/update', ModelController.update)
Route.get('/delete', ModelController.delete)
Route.post('/create', ModelController.create)


module.exports = Route