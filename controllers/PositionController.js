const { Position, Crew, Employee} = require('../models')

module.exports.index = async (req, res) => {
    let positions = await Position.findAll({
        attributes: ['id', 'name', 'salary']
    })

    res.render('index', {
        pageTitle: 'Должности',
        tableTitle: 'Должности',
        model: Position,
        data: positions,
        propNames: ['Код', 'Наименование', 'Оклад']
    })
}

module.exports.details = async (req, res) => {
    if (!req.query.id) {
        res.status(404).end('Not found')
        return
    }

    let position
    try {
        position = await Position.findOne({
            where: { id: req.query.id },
            attributes: ['id', 'name', 'salary']
        })
    } catch (e) {
        res.redirect('/position')
        return
    }

    let positionFullModel = await Position.findOne({where: { id: req.query.id }});

    if (!position) {
        res.redirect('/position')
        return
    }

    res.render('details', {
        pageTitle: 'Подробно',
        data: position,
        propNames: ['Код', 'Наименование', 'Оклад'],
        hasMany: [
            {
                data: await positionFullModel.getEmployees(),
                model: Employee,
                name: 'Сотрудники',
                fieldNames: ['Код', 'Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Номер телефона', 'Серия паспорта', 'Номер паспорта'],
                belongsTo: [
                    {
                        model: await Crew.findAll({attributes: ['id']}),
                        name: 'Экипаж'
                    }
                ]
            }
        ],
        belongsTo: []
    })
}

module.exports.update = async (req, res) => {
    try {
        let position = await Position.findOne({where: { id: req.body.id }})

        console.log(req.body.id)

        if (!position) {
            res.status(500).send('Requested record not found')
            return
        }

        for (const prop of position._options.attributes) {
            if (Number(req.body[prop])) position[prop] = Number(req.body[prop])
            else if (req.body[prop] !== 'null') position[prop] = req.body[prop]
        }
        await position.save()
        res.redirect('back')
    } catch (e) {
        res.status(500).send(e.message)
    }
}

module.exports.delete = async (req, res) => {

}