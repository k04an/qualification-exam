const { Sale, Customer, Route } = require('../models')

module.exports.index = async (req, res) => {
    let sales = await Sale.findAll({
        attributes: ['id', 'sitNumber', 'RouteId']
    })

    res.render('index', {
        pageTitle: 'Продажи',
        tableTitle: 'Продажи',
        model: Sale,
        data: sales,
        propNames: ['Код', 'Номер места'],
        belongsTo: [
            {
                model: await Customer.findAll({attributes: ['id', 'lastname', 'firstname']}),
                name: 'Клиент',
                fieldsToShow: ['lastname', 'firstname']
            },
            {
                model: await Route.findAll({attributes: ['id']}),
                name: 'Маршрут',
                fieldsToShow: ['id']
            }
        ]
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let sale
    try {
        sale = await Sale.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'sitNumber']
        })
    } catch (e) {
        res.redirect('/sale')
        return
    }

    let saleFullModel = await Sale.findOne({where: { id: req.query.id }});

    if (!sale) {
        res.redirect('/sale')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: sale,
        propNames: ['Код', 'Номер места'],
        hasMany: [],
        belongsTo: [
            {
                model: await saleFullModel.getCustomer({attributes: ['lastname', 'firstname']}),
                optionList: await Customer.findAll({attributes: ['lastname', 'firstname']}),
                name: 'Клиент'
            },
            {
                model: await saleFullModel.getRoute({attributes: ['id']}),
                optionList: await Route.findAll({attributes: ['id']}),
                name: 'Номер маршрута'
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let sale = await Plane.findOne({where: { id: req.body.id }})

        if (!sale) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of sale._options.attributes) {
            if (Number(req.body[prop])) sale[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') sale[prop] = req.body[prop]
        }
        await sale.save()
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
        await Sale.destroy({
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
        let sale = Sale.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            sale[prop] = req.body[prop]
        }
        await sale.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}