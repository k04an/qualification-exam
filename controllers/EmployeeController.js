const { Employee, Position, Crew, sequelize} = require('../models')

module.exports.index = async (req, res) => {
    let employees = await Employee.findAll({
        attributes: ['id', 'lastname', 'firstname', 'middlename', 'birthday', 'telephone', 'passportSerial', 'passportNumber']
    })

    res.render('index.ejs', {
        pageTitle: 'Сотрудники',
        tableTitle: 'Сотрудники',
        model: Employee,
        data: employees,
        propNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let employee
    try {
        employee = await Employee.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'lastname', 'firstname', 'middlename', 'birthday', 'telephone', 'passportSerial', 'passportNumber']
        })
    } catch (e) {
        res.redirect('/employee')
        return
    }

    let employeeFullModel = await Employee.findOne({where: { id: req.query.id }});

    if (!employee) {
        res.redirect('/employee')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: employee,
        propNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
        hasMany: [],
        belongsTo: [
            {
                model: await employeeFullModel.getPosition({attributes: ['name']}),
                optionList: await Position.findAll(),
                name: 'Должность'
            },
            {
                model: await employeeFullModel.getCrew({attributes: ['id']}),
                optionList: await Crew.findAll(),
                name: 'Экипаж'
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let employee = await Employee.findOne({where: { id: req.body.id }})

        if (!employee) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of employee._options.attributes) {
            if (Number(req.body[prop])) employee[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') employee[prop] = req.body[prop]
        }
        await employee.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}

module.exports.delete = async (req, res) => {
    if (!req.query.id) {
        res.status(400).send('Required parameter not provided')
        return
    }

    try {
        await Employee.destroy({
            where: { id: req.query.id }
        })
        res.redirect('back')
        return
    } catch (e) {
        res.status(500).send(e.message)
    }
}

module.exports.create = async (req, res) => {
    try {
        let employee = Employee.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            employee[prop] = req.body[prop]
        }
        await employee.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}