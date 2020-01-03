module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/evans-eats-official',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  },
  seeds: {
    directory: './db/seeds/dev'
  }
};