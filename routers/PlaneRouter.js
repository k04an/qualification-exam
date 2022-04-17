const Route = require('express').Router()
const PlaneController = require('../controllers/PlaneController')

Route.get('/', PlaneController.index)
Route.get('/details', PlaneController.details)
Route.post('/update', PlaneController.update)
Route.get('/delete', PlaneController.delete)
Route.post('/create', PlaneController.create)


module.exports = Route