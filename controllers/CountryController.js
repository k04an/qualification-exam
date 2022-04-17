const { Country, City } = require('../models')

module.exports.index = async (req, res) => {
    let countries = await Country.findAll({
        attributes: ['id', 'name']
    })

    res.render('index', {
        pageTitle: 'Страны',
        tableTitle: 'Страны',
        model: Country,
        data: countries,
        propNames: ['Код', 'Название'],
        belongsTo: []
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let country
    try {
        country = await Country.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'name']
        })
    } catch (e) {
        res.redirect('/country')
        return
    }

    let countryFullModel = await Country.findOne({where: { id: req.query.id }});

    if (!country) {
        res.redirect('/country')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: country,
        propNames: ['Код', 'Название'],
        hasMany: [
            {
                data: await countryFullModel.getCities(),
                model: City,
                name: 'Города',
                fieldNames: ['Код', 'Название'],
                belongsTo: []
            }
        ],
        belongsTo: []
    })
}

module.exports.update = async (req, res) => {
    try {
        let country = await Country.findOne({where: { id: req.body.id }})

        if (!country) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of country._options.attributes) {
            if (Number(req.body[prop])) country[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') country[prop] = req.body[prop]
        }
        await country.save()
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
        await Country.destroy({
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
        let country = Country.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            country[prop] = req.body[prop]
        }
        await country.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}