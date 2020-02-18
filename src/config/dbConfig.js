const config = {
  development: {
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL_DEV,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  test: {
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL_TEST,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  production: {
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL_PROD,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
};

export default config;
