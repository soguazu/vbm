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

export default auth;
