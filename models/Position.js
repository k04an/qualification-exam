const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Position', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })
}