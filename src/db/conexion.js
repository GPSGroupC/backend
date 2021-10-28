/*
 * conexion.js connects to a postgres database using the ORM sequelize.
 * If node server is runned locally, sequelize will connect to a local db.
 *      IMPORTANT: Execute previusly `npm run startdb` to run a docker with postgres
 * If node server is runned in Heroku, sequelize will connect to heroku db.
 */
const Sequelize = require('sequelize');
let productionDBurl = process.env.DATABASE_URL

if (productionDBurl != null) { //Conexion with production db
    sequelize = new Sequelize(productionDBurl, {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }
    );
} else { //Conexion with local db
    sequelize = new Sequelize("postgres://postgres:postgres@localhost:5432", {
            dialectOptions: {}
        }
    );
}
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.' + process.env.DATABASE_URL);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;