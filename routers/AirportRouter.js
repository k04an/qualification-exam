const Route = require('express').Router()
const AirportController = require('../controllers/AirportController')

Route.get('/', AirportController.index)
Route.get('/details', AirportController.details)
Route.post('/update', AirportController.update)
Route.get('/delete', AirportController.delete)
Route.post('/create', AirportController.create)


module.exports = Route