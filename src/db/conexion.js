
let localDBurl = "postgres://postgres:postgres@localhost:5432"

const Sequelize = require('sequelize');
sequelize = new Sequelize(process.env.DATABASE_URL || localDBurl, {
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

module.exports = sequelize;