// Читаем конфигурацию из файла .env
require('dotenv').config()

// Импортируем express
const express = require('express')
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.static('assets'))

// Устанавливаем движок шаблонизатора
app.set('view engine', 'ejs')

// Импортируем роутеры
const EmployeeRouter = require('./routers/EmployeeRouter')
const PositionRouter = require('./routers/PositionRouter')
const CrewRouter = require('./routers/CrewRouter')
const CountryRouter = require('./routers/CountryRouter')
const CityRouter = require('./routers/CityRouter')
const AirportRouter = require('./routers/AirportRouter')
const ModelRouter = require('./routers/ModelRouter')
const PlaneRouter = require('./routers/PlaneRouter')
const RouteRouter = require('./routers/RouteRouter')
const CustomerRouter = require('./routers/CustomerRouter')
const SaleRouter = require('./routers/SaleRouter')

app.use('/employee', EmployeeRouter)
app.use('/position', PositionRouter)
app.use('/crew', CrewRouter)
app.use('/country', CountryRouter)
app.use('/city', CityRouter)
app.use('/airport', AirportRouter)
app.use('/planemodel', ModelRouter)
app.use('/plane', PlaneRouter)
app.use('/route', RouteRouter)
app.use('/customer', CustomerRouter)
app.use('/sale', SaleRouter)

app.listen(process.env.PORT || 8080, () => console.log(`Web server is up on port ${process.env.PORT || 8080}`))