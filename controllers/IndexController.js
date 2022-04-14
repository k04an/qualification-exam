const { Employee } = require('../models')

module.exports.index = async (req, res) => {

    let employees = await Employee.findAll()

    employees = employees.map(employee => {
        delete employee.dataValues.createdAt
        delete employee.dataValues.updatedAt
        return employee.dataValues
    })

    res.render('index', {
        pageTitle: 'Главная',
        data: employees,
        dataPropNames: employees[0] ? Object.getOwnPropertyNames(employees[0]) : null,
        propNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта']
    })
}