require('dotenv').config()

const { faker } = require('@faker-js/faker')
const { Country, PlaneModel, Position, Crew, Customer, Route, Airport, Plane,  sequelize } = require('./models')

faker.locale = 'ru'

const config = {
    countryNumber: 5,
    citiesPerCountry: {
        from: 5,
        to: 9
    },
    airportsPerCity: {
        from: 1,
        to: 4
    },
    planeModelNumber: 7,
    planesPerModel: {
        from: 3,
        to: 6
    },
    crewNumber: 9,
    customerNumber: 14,
    salesPerCustomer: {
        from: 1,
        to: 8
    },
    routeNumber: 27
}

async function init() {
    console.log('♻ Cleaning up DB')
    await sequelize.sync({force: true})
    console.log('✅ DB is empty now')

    // Страны
    console.log('♻ Adding countries, cities and airports')
    for (i = 0; i <= config.countryNumber; i++) {
        let counrty = await Country.create({
            name: faker.address.country()
        })

        // Города
        cityNumber = faker.datatype.number({min: config.airportsPerCity.from, max: config.airportsPerCity.to})
        for (j = 0; j <= cityNumber; j++) {
            let city = await counrty.createCity({
                name: faker.address.city()
            })

            // Аэропорты
            airportNumber = faker.datatype.number({min: config.airportsPerCity.from, max: config.airportsPerCity.to})
            for (k = 0; k <= airportNumber; k++) {
                city.createAirport({
                    name: `Аэропорт им. ${faker.name.findName()}`
                })
            }
        }
    }
    

    // Модели самолетов
    console.log('♻ Adding plane models and planes')
    for (i = 0; i <= config.planeModelNumber; i++) {
        planeModel = await PlaneModel.create({
            name: `${faker.internet.password(4)}-${faker.datatype.number({min: 1000, max: 9999})}-${faker.commerce.productMaterial()}`,
            sitsNumber: faker.datatype.number({min: 100, max: 230}),
            width: faker.datatype.float({min: 2, max: 4})
        })

        // Самолеты
        planeNumber = faker.datatype.number({min: config.planesPerModel.from, max: config.planesPerModel.to})
        for (j = 0; j <= planeNumber; j++) {
            planeModel.createPlane({
                commisionDate: faker.datatype.datetime({max: Date.now()})
            })
        }
    }
    

    // Должности
    console.log('♻ Adding positions')
    captainPosition = await Position.create({
        name: 'Капитан',
        salary: 120000.0
    })
    subCaptainPosition = await Position.create({
        name: 'Помошник капитана',
        salary: 85000
    })
    flightAttantdantPosition = await Position.create({
        name: 'Бортпроводник',
        salary: 40000
    })
    

    // Экипажи
    console.log('♻ Adding crews')
    for (i = 0; i <= config.crewNumber; i++) {
        crew = await Crew.create()
        //Капитан
        crew.createEmployee({
            lastname: faker.name.lastName(),
            firstname: faker.name.firstName(),
            middlename: faker.name.middleName(),
            birthday: faker.datatype.datetime({max: new Date('2000-01-01').getTime()}),
            telephone: faker.phone.phoneNumber(),
            passportSerial: faker.datatype.number({min: 1000, max: 9999}),
            passportNumber: faker.datatype.number({min: 100000, max: 999999}),
            PositionId: captainPosition.id
        })
        // 2й пилот
        crew.createEmployee({
            lastname: faker.name.lastName(),
            firstname: faker.name.firstName(),
            middlename: faker.name.middleName(),
            birthday: faker.datatype.datetime({max: new Date('2000-01-01').getTime()}),
            telephone: faker.phone.phoneNumber(),
            passportSerial: faker.datatype.number({min: 1000, max: 9999}),
            passportNumber: faker.datatype.number({min: 100000, max: 999999}),
            PositionId: subCaptainPosition.id
        })
        // Проводники
        for (j = 0; j <= 7; j++) {
            crew.createEmployee({
                lastname: faker.name.lastName(),
                firstname: faker.name.firstName(),
                middlename: faker.name.middleName(),
                birthday: faker.datatype.datetime({max: new Date('2000-01-01').getTime()}),
                telephone: faker.phone.phoneNumber(),
                passportSerial: faker.datatype.number({min: 1000, max: 9999}),
                passportNumber: faker.datatype.number({min: 100000, max: 999999}),
                PositionId: flightAttantdantPosition.id
            })
        }
    }
    


    // Маршруты
    console.log('♻ Adding routes')
    for (i = 0; i <= config.routeNumber; i++) {
        let isTransit = Math.random() > 0.5
        dDate = faker.date.soon(10)
        aDate = faker.date.soon(1, dDate)
        tDate = faker.date.between(dDate, aDate)
        let route = await Route.create({
            fromAirportId: (await Airport.findOne({order: sequelize.random()})).id,
            toAirportId: (await Airport.findOne({order: sequelize.random()})).id,
            transitAirportId: isTransit ? (await Airport.findOne({order: sequelize.random()})).id : null,
            ticketCost: faker.commerce.price(7000, 40000),
            departureDate: dDate,
            arrivalDate: aDate,
            transitionDate: isTransit ? tDate : null,
            PlaneId: (await Plane.findOne({order: sequelize.random()})).id,
            CrewId: (await Crew.findOne({order: sequelize.random()})).id
        })
    }
    

    // Клиенты
    console.log('♻ Adding customers and sales')
    for (i = 0; i <= config.customerNumber; i++) {
        let customer = await Customer.create({
            lastname: faker.name.lastName(),
            firstname: faker.name.firstName(),
            middlename: faker.name.middleName(),
            birthday: faker.datatype.datetime({max: new Date('2000-01-01').getTime()}),
            telephone: faker.phone.phoneNumber(),
            passportSerial: faker.datatype.number({min: 1000, max: 9999}),
            passportNumber: faker.datatype.number({min: 100000, max: 999999}),
        })

        // Продажи
        sales = faker.datatype.number({min: config.salesPerCustomer.from, max: config.salesPerCustomer.to})
        for (j = 0; j <= sales; j++) {
            let route = await Route.findOne({
                order: sequelize.random(),
                include: {
                    model: Plane,
                    include: {
                        model: PlaneModel
                    }
                }
            })
            await customer.createSale({
                sitNumber: faker.datatype.number({min: 1, max: route.Plane.PlaneModel.sitsNumber}),
                RouteId: route.id
            })
        }
    }
    console.log('✅ Done')
}

init()