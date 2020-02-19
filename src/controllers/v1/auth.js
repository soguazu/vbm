import { getUserInfo, sendEmail } from '../../utils/helper';
import responseBuilder from '../../utils/error';

import userLib from '../../libs/user';

const auth = {};

auth.register = async (req, res) => {
  const { accountNo } = req.body;
  const userInformation = await getUserInfo(accountNo);

  if (userInformation.error) {
    const response = await responseBuilder({
      ...userInformation,
      status: false,
      data: {},
    });
    res.status(response.statusCode).send(response);
  }

  const user = await userLib.create(userInformation);

  await sendEmail(userInformation);
  const response = await responseBuilder({
    status: true,
    data: user,
    message: 'message sent successfully',
    statusCode: 200,
  });
  res.status(response.statusCode).send(response);
};

export default auth;
