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
    console.log(error);
    return {
      error: error.message,
      statusCode: 500,
      message: `Failure to create token: ${error.message}`,
    };
  }

  return createdToken;
};

export default token;
