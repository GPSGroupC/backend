/* knex config file.
 * This file sets postgres connection environment
 */
module.exports = {
  //local
  development: {
    client: 'pg',
    connection:'postgres://postgres:postgres@localhost:5432/postgres',
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  },

  //Heroku
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    debug: true,
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
}