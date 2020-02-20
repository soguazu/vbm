import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';

import { sequelize } from '../config/database';
import config from '../config/config';
import Token from './token';

const User = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    clientId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referralCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    underscored: false,
  },
);

User.generateAuthToken = (payload) => {
  const tokenDate = new Date();
  const refreshTokenDate = new Date();

  tokenDate.setDate(tokenDate.getDate() + 15);
  refreshTokenDate.setDate(refreshTokenDate.getDate() + 40);
  const tokenTime = Math.floor(tokenDate.getTime() / 1000);
  const refreshTime = Math.floor(refreshTokenDate.getTime() / 1000);

  const AccessToken = jwt.sign(payload, config.hashingSecret, {
    expiresIn: tokenTime,
  });

  const RefreshToken = jwt.sign(payload, config.hashingSecret, {
    expiresIn: refreshTime,
  });

  return { AccessToken, RefreshToken };
};

User.hasOne(Token, { foreignKey: 'userId', onDelete: 'cascade' });

User.findByLogin = async (authId) => {
  let user = await User.findOne({
    where: { id: authId },
  });

  if (!user) {
    user = await User.findOne({
      where: { email: authId },
    });
  }

  if (!user) {
    user = await User.findOne({
      where: { clientId: authId },
    });
  }

  return user;
};

export default User;
