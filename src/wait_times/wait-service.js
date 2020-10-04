const WaitService = {
    getAllWaits2(db, date, hour) {
        return db
            .from('wait_times')
            .join("locations", "wait_times.location_id", "=", "locations.id")
            .select(
                'wait_times.location_id as id',
                'wait_times.hour',
                db.raw('AVG(wait) AS wait_time')
            )
            .where('date', date)
            .where('hour', hour)
            .groupBy('location_id')
            .groupBy('date')
            .groupBy('hour')



    },
    getAllWaits3(db, date, hour) {
        return db
            .from('locations')
            .leftOuterJoin("wait_times", "locations.id", "wait_times.location_id")
            .select(
                'locations.id',
                'locations.name',
                'wait_times.hour',
                db.raw('AVG(wait_times.wait) AS wait_time')
            )
            .where('wait_times.date', date)
            .where('wait_times.hour', hour)
            .groupBy('locations.id')
            .groupBy('wait_times.date')
            .groupBy('wait_times.hour')
            .groupBy('locations.name')



    },
    getAllWaits4(db, date, hour) {
        return db.raw(
            `select l.id, l.name, l.address, l.link, l.hours, l.age_restrictions, l.other_details,  w.avg_wait from locations l left join (select location_id, avg(wait) as avg_wait from wait_times where hour = ${hour} and date = '${date}' group by hour, date, location_id) as w on l.id = w.location_id group by l.id, l.name, w.avg_wait`


        )



    },
    async getAllWaits(db, date, hour) {
        const waits = await db.raw(
            `select l.id, l.name, l.address, l.address_link, l.link, l.hours, l.age_restrictions, l.other_details, w.avg_wait from locations l left join (select location_id, avg(wait) as avg_wait from wait_times where hour = ${hour} and date = '${date}' group by hour, date, location_id) as w on l.id = w.location_id group by l.id, l.name, w.avg_wait`


        )

        return waits.rows



    },
    async getAllWaits6(db, date, hour, lowHour) {
        const waits = await db.raw(
            `select l.id, l.name, l.address, l.address_link, l.link, l.hours, l.age_restrictions, l.other_details, l.region, w.avg_wait, w.submissions from locations l left join (select location_id, count(id) as submissions, avg(wait) as avg_wait from wait_times where hour in (${hour},${lowHour}) and date = '${date}' group by date, location_id) as w on l.id = w.location_id group by l.id, l.name, w.avg_wait, w.submissions`


        )

        return waits.rows



    },
    getLocations(db) {
        return db
        .select('*')
            .from('locations')

    },
    insertWait(db, newWait) {
        return db
            .insert(newWait)
            .into('wait_times')
            .returning('*')
            .then(([wait]) => wait)
    },
}

module.exports = WaitService