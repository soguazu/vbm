const jwt = require('jsonwebtoken');

const config = require('../config/config');

const auth = (request, response, next) => {
    if (request.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        try {
            const decrypted = jwt.verify(req.headers.authorization.split(' ')[1], config.hashingSecret);
            request.user = decrypted;
            next();
          } catch (exception) {
            // 400 if token is bad
            return response.status(401).send({ message: exception.message });
          }
    } 
    return response.status(401).send({ message: 'Please login' });
  }
};

module.exports = auth;
