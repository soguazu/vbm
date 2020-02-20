import axios from 'axios';
import responseBuilder from '../../utils/error';

const agent = {};

agent.data = async (req, res) => {
  let response;
  const { clientId } = req.user;
  const url = `https://devesb.vfdbank.systems:8263/vfd-agent/1.0/referral/records?client=${clientId}`;

  const option = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      VFDBankAuth: process.env.API_KEY,
    },
  };

  try {
    response = await axios.get(url, option);
  } catch (error) {
    response = await responseBuilder({
      status: false,
      statusCode: response.Status,
      message: response.Message,
      data: {},
    });
    return res.status(response.statusCode).send(response);
  }

  const newResponse = await responseBuilder({
    status: true,
    statusCode: 200,
    message: response.Message,
    data: response.data.Data,
  });
  return res.status(newResponse.statusCode).send(newResponse);
};

export default agent;
