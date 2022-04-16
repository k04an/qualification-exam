const Route = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')

Route.get('/', EmployeeController.index)
Route.get('/details', EmployeeController.details)
Route.post('/update', EmployeeController.update)
Route.get('/delete', EmployeeController.delete)
Route.post('/create', EmployeeController.create)


module.exports = Route