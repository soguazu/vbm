import Sequelize from 'sequelize';
import { sequelize } from '../config/database';

const Token = sequelize.define(
  'tokens',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    access: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    refresh: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    underscored: false,
  },
);

export default Token;
