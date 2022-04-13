const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('Plane', {
        commisionDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    })
}