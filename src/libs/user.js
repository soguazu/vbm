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
      error: 'Bad token',
      statusCode: 400,
      message: 'Invalid token',
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

export default userLib;
