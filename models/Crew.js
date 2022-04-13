const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Crew')
}