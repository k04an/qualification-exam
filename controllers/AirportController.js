const { Airport, City } = require('../models')

module.exports.index = async (req, res) => {
    let airports = await Airport.findAll({
        attributes: ['id', 'name']
    })

    res.render('index', {
        pageTitle: 'Аэропорты',
        tableTitle: 'Аэропорты',
        model: Airport,
        data: airports,
        propNames: ['Код', 'Название'],
        belongsTo: [
            {
                model: await City.findAll({attributes: ['id', 'name']}),
                name: 'Город',
                fieldsToShow: ['name']
            }
        ]
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let airport
    try {
        airport = await Airport.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'name']
        })
    } catch (e) {
        res.redirect('/airport')
        return
    }

    let airportFullModel = await Airport.findOne({where: { id: req.query.id }});

    if (!airport) {
        res.redirect('/airport')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: airport,
        propNames: ['Код', 'Название'],
        hasMany: [],
        belongsTo: [
            {
                model: await airportFullModel.getCity({attributes: ['name']}),
                optionList: await City.findAll(),
                name: 'Город'
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let airport = await Airport.findOne({where: { id: req.body.id }})

        if (!airport) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of airport._options.attributes) {
            if (Number(req.body[prop])) airport[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') airport[prop] = req.body[prop]
        }
        await airport.save()
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
        await Airport.destroy({
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
        let airport = Airport.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            airport[prop] = req.body[prop]
        }
        await airport.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}