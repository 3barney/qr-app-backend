require('dotenv').config({ path: '.env' });

import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import compression from 'compression';
import expressWinston from 'express-winston';
import winstonPapertrail from 'winston-papertrail';
import jwt from 'express-jwt';

import config from './config';
import logger from './utils/logger';

const api = express();

api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('Missing authentication credentials.');
	}
});

api.use(
  expressWinston.logger({
    transports: [
      // new winston.transports.Papertrail({
      //   host: config.logger.host,
      //   port: config.logger.port,
      //   level: 'error'
      // })
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ],
    meta: true
  })
);

api.use(
  expressWinston.errorLogger({
    transports: [
      // new winston.transports.Papertrail({
      //   host: config.logger.host,
      //   port: config.logger.port,
      //   level: 'error'
      // })
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  })
)

api.listen(config.server.port, err => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  require('./utils/database');

  fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
    require('./routes/' + file)(api);
  })

  logger.info(`API is now running on port ${config.server.port} in ${config.env} mode`)
});

module.exports = api;
