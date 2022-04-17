const Route = require('express').Router()
const CustomerController = require('../controllers/CustomerController')

Route.get('/', CustomerController.index)
Route.get('/details', CustomerController.details)
Route.post('/update', CustomerController.update)
Route.get('/delete', CustomerController.delete)
Route.post('/create', CustomerController.create)


module.exports = Route