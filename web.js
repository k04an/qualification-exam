// Читаем конфигурацию из файла .env
require('dotenv').config()

// Импортируем express
const app = require('express')()

// Устанавливаем движок шаблонизатора
app.set('view engine', 'ejs')

// Импортируем роутеры
const devRouter = require('./routers/devRouter')
const WebRouter = require('./routers/WebRouter')

app.use('/dev', devRouter)
app.use('/', WebRouter)

app.listen(process.env.PORT || 8080, () => console.log(`Web server is up on port ${process.env.PORT || 8080}`))