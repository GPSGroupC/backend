//Postgres migration settings
module.exports = {
  development: {
    client: 'pg',
    connection:'postgres://postgres:postgres@localhost:5432/postgres',
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  },

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