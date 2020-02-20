const jwt = require('jsonwebtoken');

const config = require('../config/config');

const auth = (request, response, next) => {
  console.log(config);
  if (
    request.headers.authorization &&
    request.headers.authorization.split(' ')[2] === 'Basic'
  ) {
    try {
      const decrypted = jwt.verify(
        request.headers.authorization.split(' ')[3],
        config.default.hashingSecret,
      );
      request.user = decrypted;
      return next();
    } catch (exception) {
      // 400 if token is bad
      return response.status(401).send({ message: exception.message });
    }
  }
  return response.status(401).send({ message: 'Please login' });
};

export default auth;
