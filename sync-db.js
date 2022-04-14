// Утилита для синхронизации БД с моделями
require('dotenv').config()
const { sequelize, Plane } = require('./models')

sequelize.sync({force: true})
    .then(() => console.log('DB has been synced'))
    .catch(e => console.log('Something went wrong', e))
    .finally(() => process.exit(0))