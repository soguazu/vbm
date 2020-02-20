import jwt from 'jsonwebtoken';

import responseBuilder from '../../utils/error';
import config from '../../config/config';
import { generateToken } from '../../utils/helper';

import tokenLib from '../../libs/token';

const token = {};

token.validity = async (req, res) => {
  let response;

  try {
    await jwt.verify(
      req.headers.authorization.split(' ')[3],
      config.hashingSecret,
    );
  } catch (error) {
    response = await responseBuilder({
      status: false,
      message: error.message,
      statusCode: 400,
      data: error,
    });
    return res.status(response.statusCode).send(response);
  }

  response = await responseBuilder({
    status: true,
    message: 'Valid token',
    statusCode: 200,
    data: {},
  });

  return res.status(response.statusCode).send(response);
};

token.getToken = async (req, res) => {
  let response;
  let decoded;
  try {
    decoded = jwt.verify(
      req.headers.authorization.split(' ')[3],
      config.hashingSecret,
    );
  } catch (error) {
    response = await responseBuilder({
      status: false,
      message: error.message,
      statusCode: 400,
      data: error,
    });
    return res.status(response.statusCode).send(response);
  }

  response = await tokenLib.getToken(decoded);

  if (response.error) {
    response = await responseBuilder({
      status: false,
      message: response.message,
      statusCode: 400,
      data: response,
    });
    return res.status(response.statusCode).send(response);
  }

  const newToken = await generateToken({
    id: decoded.id,
    clientId: decoded.clientId,
  });

  response = await responseBuilder({
    status: true,
    data: { token: newToken },
    message: 'Generated new access token successfully',
    statusCode: 202,
  });
  return res.status(response.statusCode).send(response);
};

export default token;
