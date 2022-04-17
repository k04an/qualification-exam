const Route = require('express').Router()
const PositionController = require('../controllers/PositionController')

Route.get('/', PositionController.index)
Route.get('/details', PositionController.details)
Route.post('/update', PositionController.update)
Route.get('/delete', PositionController.delete)
Route.post('/create', PositionController.create)



module.exports = Route