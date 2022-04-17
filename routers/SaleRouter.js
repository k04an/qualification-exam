const Route = require('express').Router()
const SaleController = require('../controllers/SaleController')

Route.get('/', SaleController.index)
Route.get('/details', SaleController.details)
Route.post('/update', SaleController.update)
Route.get('/delete', SaleController.delete)
Route.post('/create', SaleController.create)

module.exports = Route