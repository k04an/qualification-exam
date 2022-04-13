const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('City', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}