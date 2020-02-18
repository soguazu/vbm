/* eslint-disable no-undef */
const environments = {};

const sharedEnvVariables = {
  hashingSecret: process.env.MY_SECRET || 'xyz',
  service: process.env.SERVICE,
  mail: process.env.FROM_EMAIL,
  password: process.env.EMAIL_PASSWORD,
  dialect: 'postgres',
};

// Development environment
environments.development = {
  envName: 'development',
  url:
    process.env.DATABASE_URL_DEV ||
    'postgres://postgres@localhost:5432/vbm-dev',
  httpPort: 8080,
  ...sharedEnvVariables,
};

// Production environment
environments.production = {
  envName: 'production',
  url: process.env.DATABASE_URL_PROD,
  httpPort: 80,
  ...sharedEnvVariables,
};

environments.test = {
  envName: 'test',
  url:
    process.env.DATABASE_URL_TEST ||
    'postgres://postgres@localhost:5432/vbm-test',
  httpPort: 8080,
  ...sharedEnvVariables,
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.development;

// Export the module
export { environmentToExport as default };
