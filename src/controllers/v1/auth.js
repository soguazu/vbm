import { getUserInfo, sendEmail } from '../../utils/helper';
import responseBuilder from '../../utils/error';

import userLib from '../../libs/user';

const auth = {};

auth.register = async (req, res) => {
  let response;
  const { accountNo } = req.body;
  const userInformation = await getUserInfo(accountNo);

  if (userInformation.error) {
    response = await responseBuilder({
      ...userInformation,
      status: false,
      data: {},
    });
    return res.status(response.statusCode).send(response);
  }

  response = await userLib.create(userInformation);
  if (response.error) {
    response = await responseBuilder({
      ...response,
      status: false,
      data: {},
    });
    return res.status(response.statusCode).send(response);
  }

  await sendEmail(userInformation);
  response = await responseBuilder({
    status: true,
    data: {},
    message: 'message sent successfully',
    statusCode: 200,
  });
  res.status(response.statusCode).send(response);
};

auth.login = async (req, res) => {
  let response;
  const { email, password } = req.body;
  const payload = {
    email,
    password,
  };
  response = await userLib.login(payload);
  if (response.error) {
    response = await responseBuilder({
      status: false,
      data: response.error,
      message: response.message,
      statusCode: response.statusCode,
    });
    return res.status(response.statusCode).send(response);
  }

  response = await responseBuilder({
    status: response.status,
    data: response.data,
    message: response.message,
    statusCode: response.statusCode,
  });
  res.status(response.statusCode).send(response);
};

export default auth;
