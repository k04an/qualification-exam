const Route = require('express').Router()
const CrewController = require('../controllers/CrewController')

Route.get('/', CrewController.index)
Route.get('/details', CrewController.details)
Route.post('/update', CrewController.update)
Route.get('/delete', CrewController.delete)
Route.post('/create', CrewController.create)


module.exports = Route