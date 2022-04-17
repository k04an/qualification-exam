const { Route, Airport, Plane, Crew } = require('../models')

module.exports.index = async (req, res) => {
    let routes = await Route.findAll({
        attributes: ['id', 'ticketCost', 'departureDate', 'arrivalDate', 'transitionDate']
    })

    res.render('index', {
        pageTitle: 'Маршруты',
        tableTitle: 'Маршруты',
        model: Route,
        data: routes,
        propNames: ['Код', 'Стоимость билета', 'Дата отправления', 'Дата прибытия', 'Дата пересадки'],
        belongsTo: [
            {
                model: await Airport.findAll({attributes: ['id', 'name']}),
                name: 'Аэропорт отправления',
                fieldsToShow: ['name'],
                customFieldName: 'fromAirport'
            },
            {
                model: await Airport.findAll({attributes: ['id', 'name']}),
                name: 'Аэропорт прибытия',
                fieldsToShow: ['name'],
                customFieldName: 'toAirport'
            },
            {
                model: await Airport.findAll({attributes: ['id', 'name']}),
                name: 'Аэропорт пересадки',
                fieldsToShow: ['name'],
                customFieldName: 'transitAirport'
            },
            {
                model: await Plane.findAll({attributes: ['id']}),
                name: 'Самолет',
                fieldsToShow: ['id']
            },
            {
                model: await Crew.findAll({attributes: ['id']}),
                name: 'Экипаж',
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

    let route
    try {
        route = await Route.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'ticketCost', 'departureDate', 'arrivalDate', 'transitionDate']
        })
    } catch (e) {
        res.redirect('/route')
        return
    }

    let routeFullModel = await Route.findOne({where: { id: req.query.id }});

    if (!route) {
        res.redirect('/route')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: route,
        propNames: ['Код', 'Стоимость билета', 'Дата отправления', 'Дата прибытия', 'Дата пересадки'],
        hasMany: [],
        belongsTo: [
            {
                model: await routeFullModel.getFromAirport({attributes: ['name']}),
                optionList: await Airport.findAll({attributes: ['name']}),
                name: 'Аэропорт отправления',
                customFieldName: 'fromAirport'
            },
            {
                model: await routeFullModel.getToAirport({attributes: ['name']}),
                optionList: await Airport.findAll({attributes: ['name']}),
                name: 'Аэропорт прибытия',
                customFieldName: 'toAirport'
            },
            {
                model: await routeFullModel.getTransitAirport({attributes: ['name']}),
                optionList: await Airport.findAll({attributes: ['name']}),
                name: 'Аэропорт пересадки',
                customFieldName: 'transitAirport'
            },
            {
                model: await routeFullModel.getCrew({attributes: ['id']}),
                optionList: await Crew.findAll({attributes: ['id']}),
                name: 'Экипаж'
            },
            {
                model: await routeFullModel.getPlane({attributes: ['id']}),
                optionList: await Plane.findAll({attributes: ['id']}),
                name: 'Самолет'
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let route = await Route.findOne({where: { id: req.body.id }})

        if (!route) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of route._options.attributes) {
            if (Number(req.body[prop])) route[prop] = Number(req.body[prop])
            else if (req.body[prop] === '') route[prop] = null
            else if (req.body[prop] !== 'null') route[prop] = req.body[prop]
        }
        await route.save()
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
        await Route.destroy({
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
        let route = Route.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            if (req.body[prop] === '') route[prop] = null
            else route[prop] = req.body[prop]
        }
        await route.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}