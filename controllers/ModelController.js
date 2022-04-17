const { PlaneModel, Plane } = require('../models')

module.exports.index = async (req, res) => {
    let models = await PlaneModel.findAll({
        attributes: ['id', 'name', 'sitsNumber', 'width']
    })

    res.render('index.ejs', {
        pageTitle: 'Модели самолетов',
        tableTitle: 'Модели самолетов',
        model: PlaneModel,
        data: models,
        propNames: ['Код', 'Название', 'Кол-во сидений', 'Ширина салона'],
        belongsTo: []
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let model
    try {
        model = await PlaneModel.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'name', 'sitsNumber', 'width']
        })
    } catch (e) {
        res.redirect('/planemodel')
        return
    }

    let modelFullModel = await PlaneModel.findOne({where: { id: req.query.id }});

    if (!model) {
        res.redirect('/planemodel')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: model,
        propNames: ['Код', 'Название', 'Кол-во сидений', 'Ширина салона'],
        hasMany: [
            {
                data: await modelFullModel.getPlanes(),
                model: Plane,
                name: 'Самолеты',
                fieldNames: ['Код', 'Дата введения в эксплуатацию'],
                belongsTo: []
            }
        ],
        belongsTo: []
    })
}

module.exports.update = async (req, res) => {
    try {
        let model = await PlaneModel.findOne({where: { id: req.body.id }})

        if (!model) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of model._options.attributes) {
            if (Number(req.body[prop])) model[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') model[prop] = req.body[prop]
        }
        await model.save()
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
        await PlaneModel.destroy({
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
        let model = PlaneModel.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            model[prop] = req.body[prop]
        }
        await model.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}