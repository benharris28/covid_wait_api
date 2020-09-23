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
    getAllWaits(db, date, hour) {
        return db
            .from('locations')
            .select(
                'locations.id',
                'locations.name',
               
            )
            .leftOuterJoin("wait_times", "locations.id", "wait_times.location_id")
            .select( 'wait_times.hour',
            db.raw('AVG(wait_times.wait) AS wait_time'))
            .whereIn('wait_times.date', [date,null])
            .whereIn('wait_times.hour', [hour, null])
            .groupBy('locations.id')
            .groupBy('wait_times.date')
            .groupBy('wait_times.hour')
            .groupBy('locations.name')
        

         
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