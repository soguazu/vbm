import Sequelize from 'sequelize';
import config from './config';

const sequelize = new Sequelize(config.dbUrl, {
  dialect: 'postgres',
});

const { Op } = Sequelize;
export { sequelize, Op };
