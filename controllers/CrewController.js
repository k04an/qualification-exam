const { Crew, Position, Employee} = require('../models')

module.exports.index = async (req, res) => {
    let crews = await Crew.findAll({
        attributes: ['id']
    })

    res.render('index', {
        pageTitle: 'Экипажи',
        tableTitle: 'Экипажи',
        model: Crew,
        data: crews,
        propNames: ['Номер экипажа'],
        belongsTo: []
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let crew
    try {
        crew = await Crew.findOne({
            where: { id: req.query.id },
            attributes: ['id']
        })
    } catch (e) {
        res.redirect('/crew')
        return
    }

    let crewFullModel = await Crew.findOne({where: { id: req.query.id }});

    if (!crew) {
        res.redirect('/crew')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: crew,
        propNames: ['Номер экипажа'],
        hasMany: [
            {
                data: await crewFullModel.getEmployees(),
                model: Employee,
                name: 'Сотрудники',
                fieldNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
                belongsTo: [
                    {
                        model: await Position.findAll({attributes: ['id', 'name']}),
                        name: 'Должность',
                        fieldsToShow: ['name']
                    }
                ]
            }
        ],
        belongsTo: []
    })
}

module.exports.update = async (req, res) => {
    try {
        let crew = await Crew.findOne({where: { id: req.body.id }})

        if (!crew) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of crew._options.attributes) {
            if (Number(req.body[prop])) crew[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') crew[prop] = req.body[prop]
        }
        await crew.save()
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
        await Crew.destroy({
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
        let crew = Crew.build()
        for (const prop of Object.getOwnPropertyNames(req.body)) {
            crew[prop] = req.body[prop]
        }
        await crew.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}