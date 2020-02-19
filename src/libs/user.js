import bcryptjs from 'bcryptjs';

import User from '../models/user';
import { verifyAccount, hashPassword } from '../utils/helper';

const userLib = {};

userLib.create = async (payload) => {
  let user;
  try {
    user = await User.create({
      email: payload.Email,
      name: payload.Name,
      clientId: payload['Client ID'],
      phone: payload.Phone,
      password: null,
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Create user error: ${error.errors[0].message}`,
    };
  }

  return user;
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
      message: `Failure to update user password: ${error.errors[0].message}`,
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

  return {
    status: true,
    statusCode: 200,
    message: 'Login successfully',
    data: {
      token,
      id: user.id,
      name: user.name,
      clientId: user.clientId,
    },
  };
};

export default userLib;
