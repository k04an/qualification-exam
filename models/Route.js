const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Route', {
        fromAirportId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        toAirportId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transitAirportId: DataTypes.INTEGER,
        ticketCost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        departureDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        arrivalDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        transitionDate: DataTypes.DATE
    })
}