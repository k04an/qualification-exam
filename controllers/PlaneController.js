const { Plane, PlaneModel } = require('../models')

module.exports.index = async (req, res) => {
    let planes = await Plane.findAll({
        attributes: ['id', 'commisionDate']
    })

    res.render('index', {
        pageTitle: 'Самолеты',
        tableTitle: 'Самолеты',
        model: Plane,
        data: planes,
        propNames: ['Код', 'Дата введения в эксплуатацию'],
        belongsTo: [
            {
                model: await PlaneModel.findAll({attributes: ['id', 'name']}),
                name: 'Модель',
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

    let plane
    try {
        plane = await Plane.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'commisionDate']
        })
    } catch (e) {
        res.redirect('/plane')
        return
    }

    let planeFullModel = await Plane.findOne({where: { id: req.query.id }});

    if (!plane) {
        res.redirect('/plane')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: plane,
        propNames: ['Код', 'Дата введения в эксплуатацию'],
        hasMany: [],
        belongsTo: [
            {
                model: await planeFullModel.getPlaneModel({attributes: ['name']}),
                optionList: await PlaneModel.findAll(),
                name: 'Модель',
                fieldsToShow: ['name']
            }
        ]
    })
}

module.exports.update = async (req, res) => {
    try {
        let plane = await Plane.findOne({where: { id: req.body.id }})

        if (!plane) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of plane._options.attributes) {
            if (Number(req.body[prop])) plane[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') plane[prop] = req.body[prop]
        }
        await plane.save()
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
        await Plane.destroy({
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
        let plane = Plane.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            plane[prop] = req.body[prop]
        }
        await plane.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}