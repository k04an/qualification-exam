const { DataTypes } = require('sequelize')

module.exports = async (sequelize) => {
    return sequelize.define('Customer', {
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        middlename: DataTypes.STRING,
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passportSerial: {
            type: DataTypes.INTEGER,
            validate: {
                len: 4
            }
        },
        passportNumber: {
            type: DataTypes.INTEGER,
            validate: {
                len: 6
            }
        }
    })
}