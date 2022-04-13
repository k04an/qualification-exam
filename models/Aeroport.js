const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Aeroport', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}