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
}

module.exports = WaitService