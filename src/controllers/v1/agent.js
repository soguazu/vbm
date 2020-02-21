import axios from 'axios';
import responseBuilder from '../../utils/error';

import getAgentDetail from '../../utils/agentInfo';

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
  const { TotalActiveClients, TotalDeposits } = response.data.Data;

  const agentData = await getAgentDetail(+TotalActiveClients, +TotalDeposits);

  const newResponse = await responseBuilder({
    status: true,
    statusCode: 200,
    message: response.Message,
    data: {
      ...response.data.Data,
      ...agentData,
    },
  });
  return res.status(newResponse.statusCode).send(newResponse);
};

export default agent;
