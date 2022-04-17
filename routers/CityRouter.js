const Route = require('express').Router()
const CityController = require('../controllers/CityController')

Route.get('/', CityController.index)
Route.get('/details', CityController.details)
Route.post('/update', CityController.update)
Route.get('/delete', CityController.delete)
Route.post('/create', CityController.create)


module.exports = Route