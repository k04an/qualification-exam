const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    return sequelize.define('PlaneModel', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sitsNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })
}