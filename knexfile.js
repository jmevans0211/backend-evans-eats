module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/evans-eats-official',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },
  production: {
    client: 'pg',
    connection: 'postgres://hhmyqmwyscuswo:d3bc44d057033e667d65ba379c70b035970cea471cd61c39bf3181b5af8ab01b@ec2-3-214-53-225.compute-1.amazonaws.com:5432/d17584cqcofem0',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/migrations/seeds/dev'
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/evans-eats-official',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/migrations/seeds/test'
    },
    useNullAsDefault: true
  }
};
