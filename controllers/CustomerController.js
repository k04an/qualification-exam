const { Customer, Sale, Route } = require('../models')

module.exports.index = async (req, res) => {
    let customers = await Customer.findAll({
        attributes: ['id', 'lastname', 'firstname', 'middlename', 'birthday', 'telephone', 'passportSerial', 'passportNumber']
    })

    res.render('index.ejs', {
        pageTitle: 'Сотрудники',
        tableTitle: 'Сотрудники',
        model: Customer,
        data: customers,
        propNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
        belongsTo: []
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let customer
    try {
        customer = await Customer.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'lastname', 'firstname', 'middlename', 'birthday', 'telephone', 'passportSerial', 'passportNumber']
        })
    } catch (e) {
        res.redirect('/customer')
        return
    }

    let customerFullModel = await Customer.findOne({where: { id: req.query.id }});

    if (!customer) {
        res.redirect('/customer')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: customer,
        propNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
        hasMany: [
            {
                data: await customerFullModel.getSales({attributes: ['id', 'sitNumber']}),
                model: Sale,
                name: 'Покупки',
                fieldNames: ['Код', 'Номер места'],
                belongsTo: [
                    {
                        model: await Route.findAll({
                            attributes: ['id', 'fromAirportId', 'toAirportId']
                        }),
                        name: 'Маршрут',
                        fieldsToShow: ['fromAirportId', 'toAirportId']
                    }
                ]
            }
        ],
        belongsTo: []
    })
}

module.exports.update = async (req, res) => {
    try {
        let customer = await Customer.findOne({where: { id: req.body.id }})

        if (!customer) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of customer._options.attributes) {
            if (Number(req.body[prop])) customer[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') customer[prop] = req.body[prop]
        }
        await customer.save()
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
        await Customer.destroy({
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
        let customer = Customer.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            customer[prop] = req.body[prop]
        }
        await customer.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}