const config = require('../config/config');

const auth = (request, response, next) => {
  if (
    request.headers.authorization &&
    request.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    if (
      request.headers.authorization.split(' ')[1] === process.env.MY_API_KEY
    ) {
      return next();
    }
  }
  return response.status(401).send({ message: 'Unauthorized access' });
};

export default auth;
