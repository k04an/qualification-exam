const Sequelize = require('sequelize')
if (!process.env.DB_URI) throw new Error('Can not find DB_URI in .env')
const sequelize = new Sequelize(process.env.DB_URI, {
    logging: false
})
sequelize.authenticate()
    .catch(() => {throw new Error('Can not connect to DB')})

// Создаем модели
require('./Plane')(sequelize)
require('./PlaneModel')(sequelize)
require('./City')(sequelize)
require('./Country')(sequelize)
require('./Airport')(sequelize)
require('./Position')(sequelize)
require('./Employee')(sequelize)
require('./Route')(sequelize)
require('./Crew')(sequelize)
require('./Customer')(sequelize)
require('./Sale')(sequelize)

// Определяем свзяи
sequelize.models.Plane.belongsTo(sequelize.models.PlaneModel)
sequelize.models.PlaneModel.hasMany(sequelize.models.Plane)

sequelize.models.Airport.belongsTo(sequelize.models.City)
sequelize.models.City.hasMany(sequelize.models.Airport)

sequelize.models.City.belongsTo(sequelize.models.Country)
sequelize.models.Country.hasMany(sequelize.models.City)

sequelize.models.Employee.belongsTo(sequelize.models.Position)
sequelize.models.Position.hasMany(sequelize.models.Employee)

sequelize.models.Route.belongsTo(sequelize.models.Airport, {
    foreignKey: 'fromAirportId',
    as: 'FromAirport'
})
sequelize.models.Airport.hasMany(sequelize.models.Route, {
    foreignKey: 'fromAirportId'
})

sequelize.models.Route.belongsTo(sequelize.models.Airport, {
    foreignKey: 'toAirportId',
    as: 'ToAirport'
})
sequelize.models.Airport.hasMany(sequelize.models.Route, {
    foreignKey: 'toAirportId'
})

sequelize.models.Route.belongsTo(sequelize.models.Airport, {
    foreignKey: 'transitAirportId',
    as: 'TransitAirport'
})
sequelize.models.Airport.hasMany(sequelize.models.Route, {
    foreignKey: 'transitAirportId'
})

sequelize.models.Route.belongsTo(sequelize.models.Plane)
sequelize.models.Plane.hasMany(sequelize.models.Route)

sequelize.models.Crew.hasMany(sequelize.models.Employee)
sequelize.models.Employee.belongsTo(sequelize.models.Crew)

sequelize.models.Crew.hasMany(sequelize.models.Route)
sequelize.models.Route.belongsTo(sequelize.models.Crew)

sequelize.models.Customer.hasMany(sequelize.models.Sale)
sequelize.models.Sale.belongsTo(sequelize.models.Customer)

sequelize.models.Route.hasMany(sequelize.models.Sale)
sequelize.models.Sale.belongsTo(sequelize.models.Route)

module.exports = sequelize.models
module.exports.sequelize = sequelize