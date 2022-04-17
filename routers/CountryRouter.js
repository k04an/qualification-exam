const Route = require('express').Router()
const CountryController = require('../controllers/CountryController')

Route.get('/', CountryController.index)
Route.get('/details', CountryController.details)
Route.post('/update', CountryController.update)
Route.get('/delete', CountryController.delete)
Route.post('/create', CountryController.create)


module.exports = Route