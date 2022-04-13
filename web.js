// Читаем конфигурацию из файла .env
require('dotenv').config()

// Импортируем express
const app = require('express')()

// Импортируем роутеры
const devRouter = require('./routers/devRouter')

app.use('/dev', devRouter)

app.listen(process.env.PORT || 8080, () => console.log(`Web server is up on port ${process.env.PORT || 8080}`))