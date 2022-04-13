const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Country', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}