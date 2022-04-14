const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Airport', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}