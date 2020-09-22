const WaitService = {
    getAllWaits(db, date, hour) {
        return db
            .from('wait_times')
            .select(
                'location_id',
                'hour',
                db.raw('AVG(wait) AS wait_time')
            )
            .where('date', date)
            .where('hour', hour)
            .groupBy('location_id')
            .groupBy('date')
            .groupBy('hour')
        

         
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