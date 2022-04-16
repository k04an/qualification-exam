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

app.use('/employee', EmployeeRouter)
app.use('/position', PositionRouter)

app.listen(process.env.PORT || 8080, () => console.log(`Web server is up on port ${process.env.PORT || 8080}`))