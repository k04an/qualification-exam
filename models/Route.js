const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Route', {
        fromAeroportId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        toAeroportId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transitAeroportId: DataTypes.INTEGER,
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