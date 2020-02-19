import responseBuilder from '../../utils/error';

import userLib from '../../libs/user';

const user = {};

user.password = async (req, res) => {
  let response;
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  response = await userLib.updatePassword(payload);

  if (response.error) {
    response = await responseBuilder({
      status: false,
      statusCode: response.statusCode,
      message: response.message,
      data: {},
    });
    return res.status(response.statusCode).send(response);
  }

  response = await responseBuilder({
    status: true,
    data: {},
    message: 'Password updated successfully',
    statusCode: 202,
  });
  res.status(response.statusCode).send(response);
};

export default user;
