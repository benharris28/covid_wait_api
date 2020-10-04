const path = require('path')
const express = require('express')
const WaitService = require('./wait-service')


const waitRouter = express.Router()
const jsonBodyParser = express.json()

waitRouter
.route('/')
.get((req, res, next) => {

    const { date, hour } = req.query;
   const lowHour = Number(hour - 1)
    
    console.log(hour)
    console.log(lowHour)

    WaitService.getAllWaits6(
        req.app.get('db'),
        date,
        hour,
        lowHour
    )
    .then(waits => {
        res.json(waits)
    })
    .catch(next)
})
.post(jsonBodyParser, (req, res, next) => {
    const { location_id, wait, date, hour } = req.query;

    
    const newWait = { 
        location_id,
        wait,
        date,
        hour
    } 

    WaitService.insertWait(
        req.app.get('db'),
        newWait
    )
        .then(wait => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl))
                .json(wait)
        })
        .catch(next) 
})

waitRouter
.route('/locations')
.get((req, res, next) => {


    WaitService.getLocations(
        req.app.get('db')
    )
    .then(locations => {
        res.json(locations)
    })
    .catch(next)
})
module.exports = waitRouter;