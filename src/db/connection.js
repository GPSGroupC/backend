/*
 * connection.js creates a connection pool with postgres db.
 * If `npm start` is executed locally, node will connect to local postgres.
 * If `npm start` is executed in heroku,node will connect to heroku postgres.
 */
const { Pool } = require('pg')
let connectionString = "postgres://postgres:postgres@localhost:5432/postgres"

let client = new Pool({
    connectionString: process.env.DATABASE_URL || connectionString,
    ssl: (process.env.DATABASE_URL == null)
        ? false //ssl off
        : {rejectUnauthorized: false} //ssl on
})

client.connect((err, client, release) => {
        if (err) {
            return console.error('Unable to connect to the database: ', err.stack)
        } else {
            return console.log("Connection has been established successfully.")
        }
})
module.exports = client;