const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('Sale', {
        sitNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}