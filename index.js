import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';

import config from './src/config/config';
import winston from './src/config/winston';
import terminate from './src/config/error';
import v1 from './src/routes/index';
import { sequelize } from './src/config/database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding Helmet to enhance your API's security
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan('combined', { stream: winston.stream }));

app.use(v1);

const server = http.createServer(app);

server.on('connection', (socket) => {
  socket.setNoDelay(true); // disable nagle algorithm//console.log('no delay set')
});

sequelize
  .sync()
  .then(() => {
    winston.debug('Database connected successfully');
    server.listen(config.httpPort, '0.0.0.0', () => {
      winston.debug(
        `Server listening on port ${config.httpPort} and running on ${config.envName} environment`,
      );
    });
  })
  .catch((error) => {
    winston.debug(`Something went wrong: ${error}`);
  });

const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
