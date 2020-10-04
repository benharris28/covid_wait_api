const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const MapService = {
    async getMarkers(db, lat, lng) {
        
        let query = await db.raw( 
            `select id, name, address, address_link, link, hours, age_restrictions, other_details, region, lat, lng,  distance
            from locations
            
            join (
            SELECT id as location_id,
            (3959 * acos( cos( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( lat ) ) ) ) AS distance
            FROM locations) as s on s.location_id = locations.id and distance < 30
            ORDER BY distance 
            LIMIT 25;`
                )

                return query.rows
               
            
            



         

   



         
    },
    updateMarker(db, id, update) {
        
    }
   
}

module.exports = MapService
