import Token from '../models/token';

const token = {};

token.create = async (payload) => {
  let createdToken;
  try {
    createdToken = await Token.create({
      userId: payload.id,
      access: payload.AccessToken,
      refresh: payload.RefreshToken,
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to create token: ${error.message}`,
    };
  }

  return createdToken;
};

token.getToken = async (payload) => {
  let retreivedToken;
  try {
    retreivedToken = await Token.findOne({
      where: {
        userId: payload.id,
      },
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Unrecognize token: ${error.message}`,
    };
  }

  if (!retreivedToken) {
    return {
      error: 'Invalid token',
      statusCode: 500,
      message: 'Unrecognize token',
    };
  }
  return retreivedToken;
};

export default token;
