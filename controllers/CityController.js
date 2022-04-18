const { City, Country, Airport } = require('../models')

module.exports.index = async (req, res) => {
    let cities = await City.findAll({
        attributes: ['id', 'name']
    })

    res.render('index', {
        pageTitle: 'Города',
        tableTitle: 'Города',
        model: City,
        data: cities,
        propNames: ['Код', 'Название'],
        belongsTo: [
            {
                model: await Country.findAll({attributes: ['id', 'name']}),
                name: 'Страна',
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

    let city
    try {
        city = await City.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'name']
        })
    } catch (e) {
        res.redirect('/city')
        return
    }

    let cityFullModel = await City.findOne({where: { id: req.query.id }});

    if (!city) {
        res.redirect('/city')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: city,
        propNames: ['Код', 'Название'],
        hasMany: [
            {
                data: await cityFullModel.getAirports(),
                model: Airport,
                name: 'Аэропорты',
                fieldNames: ['Код', 'Название'],
                belongsTo: []
            }
        ],
        belongsTo: [
            {
                model: await cityFullModel.getCountry({attributes: ['name']}),
                optionList: await Country.findAll(),
                name: 'Страна',
                fieldsToShow: ['name']
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let city = await City.findOne({where: { id: req.body.id }})

        if (!city) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of city._options.attributes) {
            if (Number(req.body[prop])) city[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') city[prop] = req.body[prop]
        }
        await city.save()
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
        await City.destroy({
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
        let city = City.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            city[prop] = req.body[prop]
        }
        await city.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}