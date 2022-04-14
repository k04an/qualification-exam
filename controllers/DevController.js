const { Route, Plane, PlaneModel, sequelize } = require('../models')

module.exports.index = async (req, res) => {
    let result = await Route.findOne({
        order: sequelize.random(),
        include: {
            model: Plane,
            include: {
                model: PlaneModel
            }
        }
    })
    res.json(result)
}