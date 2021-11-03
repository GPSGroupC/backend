/*
 * conexion.js connects to a postgres database using the ORM sequelize.
 * If node server is runned locally, sequelize will connect to a local db.
 *      IMPORTANT: Execute previusly `npm run startdb` to run a docker with postgres
 * If node server is runned in Heroku, sequelize will connect to heroku db.
 */
const Sequelize = require('sequelize');
const { Client } = require('pg');

process.env.DATABASE_URL = "postgres://itmsioxcrlmkte:8a08f8d8c98c1c9adde8a852914e23de5572d0e9585d165b20d37204652cbfcb@ec2-79-125-30-28.eu-west-1.compute.amazonaws.com:5432/d6c2qp25ec15kk"

 //Conexion with production db
   
const connection = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
});


connection.connect (function (err) {
    if(err){
        console.log('Error when connecting to db:', err);
    }else{
        console.log('Connection has been established successfully.');
    }
    
})

 //Conexion with local db
 //Diego si lees esto lo he comentado porque me dijiste de usar la de produccion cuando haya más tiempo lo miramos
/*
sequelize = new Sequelize("postgres://postgres:postgres@localhost:5432", {
            dialectOptions: {}
     }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.' + process.env.DATABASE_URL);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
*/
module.exports = connection;