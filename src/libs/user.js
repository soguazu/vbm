import bcryptjs from 'bcryptjs';
import uniqid from 'uniqid';
import _ from 'lodash';

import User from '../models/user';
import { verifyAccount, hashPassword, sendEmail } from '../utils/helper';
import tokenLib from './token';

const userLib = {};

userLib.create = async (payload) => {
  let user;

  try {
    user = await User.create({
      email: payload.Email,
      name: payload.Name,
      clientId: payload['Client ID'],
      phone: payload.Phone,
      referralCode: payload['Referral Code'],
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Someone has registered with this account: ${error.message}`,
    };
  }

  const token = User.generateAuthToken({
    id: user.id,
    clientId: user.clientId,
  });

  const response = await tokenLib.create({ ...token, id: user.id });

  if (response.error) {
    return {
      error: response.error,
      statusCode: response.statusCode,
      message: response.message,
    };
  }

  return {
    ..._.pick(user, [
      'id',
      'name',
      'email',
      'cliendId',
      'phone',
      'referralCode',
      'accountNo',
    ]),
    ...token,
  };
};

userLib.updatePassword = async (payload) => {
  let response = await verifyAccount(payload.email);

  if (response.error) {
    return {
      error: response.error,
      statusCode: response.statusCode,
      message: response.message,
    };
  }
  const password = await hashPassword(payload.password);

  try {
    response = await User.update(
      { password },
      {
        where: {
          id: response.id,
        },
        returning: true,
        plain: true,
      },
    );
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to update user password: ${error.message}`,
    };
  }

  return response;
};

userLib.login = async (payload) => {
  let user;
  let validPassword;
  try {
    user = await User.findOne({
      where: {
        email: payload.email,
      },
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 404,
      message: 'User not found',
    };
  }

  if (!user) {
    return {
      error: 'User not found',
      statusCode: 404,
      message: 'User not found',
    };
  }

  try {
    validPassword = await bcryptjs.compare(payload.password, user.password);
  } catch (error) {
    return {
      error: error.message,
      statusCode: 404,
      message: 'Invalid email or password',
    };
  }
  if (!validPassword) {
    return {
      error: 'wrong password',
      statusCode: 400,
      message: 'Invalid email or password',
    };
  }
  const data = {
    id: user.id,
    clientId: user.clientId,
  };
  // Generating token if login was successfully
  const token = User.generateAuthToken(data);

  const response = await tokenLib.create({ ...token, id: user.id });

  if (response.error) {
    return {
      error: response.error,
      statusCode: response.statusCode,
      message: response.message,
    };
  }

  return {
    status: true,
    statusCode: 200,
    message: 'Login successfully',
    data: {
      token,
      id: user.id,
      name: user.name,
      clientId: user.clientId,
      referralCode: user.referralCode,
      accountNo: user.accountNo,
    },
  };
};

userLib.forgotPassword = async (email) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email,
      },
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 404,
      message: `Failure to update user password: ${error.message}`,
    };
  }
  if (!user) {
    return {
      error: 'User not found',
      statusCode: 404,
      message: 'User not found',
    };
  }
  await sendEmail({ Email: email, Name: user.name }, 'user/reset-password');
  return {
    status: true,
    statusCode: 200,
    message: 'Mail sent successfully',
    data: {},
  };
};

userLib.resetPassword = async (payload) => {
  let response = await verifyAccount(payload.email);

  if (response.error) {
    return {
      error: response.error,
      statusCode: response.statusCode,
      message: response.message,
    };
  }
  const password = await hashPassword(payload.password);

  try {
    response = await User.update(
      { password },
      {
        where: {
          id: response.id,
        },
        returning: true,
        plain: true,
      },
    );
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to update user password: ${error.message}`,
    };
  }

  return response;
};

userLib.changePassword = async (payload) => {
  let response;
  let user;
  try {
    user = await User.findByPk(payload.id);
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to get user: ${error.message}`,
    };
  }

  if (!user) {
    return {
      error: 'User not found',
      statusCode: 500,
      message: 'User not found',
    };
  }

  try {
    response = await User.update(
      { password: payload.password },
      {
        where: {
          id: user.id,
        },
        returning: true,
        plain: true,
      },
    );
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to update user password: ${error.message}`,
    };
  }

  return response;
};

export default userLib;
