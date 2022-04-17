const Route = require('express').Router()
const RouteController = require('../controllers/RouteController')

Route.get('/', RouteController.index)
Route.get('/details', RouteController.details)
Route.post('/update', RouteController.update)
Route.get('/delete', RouteController.delete)
Route.post('/create', RouteController.create)

module.exports = Route