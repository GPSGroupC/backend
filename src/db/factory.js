/*
 * This file uses the Factory pattern to group all database access
 */
const client = require('../db/connection.js')

exports.getCalendar = async () => {
    try {
        res = await client.query('SELECT type FROM Calendar')
        console.log("factory: " + res)
        return res.rows[0];
    } catch(err) {
        console.log("getting calendar type: " + err.stack)
    }

}

