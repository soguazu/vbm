import Sequelize from 'sequelize';
import config from './config';

const env = process.env.NODE_ENV || 'development';
const dbSettings = config[env];

const sequelize = new Sequelize(dbSettings.url, {
  dialect: 'postgres',
});

const { Op } = Sequelize;
module.exports = { sequelize, Op };
