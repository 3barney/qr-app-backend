import mongoose from 'mongoose';

import config from '../../config';
import logger from '../logger';

mongoose.Promise = global.Promise;

const developmentUrl = 'mongodb://localhost/qrApp';
const productionUrl = 'mongodb://username:password@host:port/database'

const databaseUrl = (config.env === 'development') ? developmentUrl: productionUrl;

const connection = mongoose.connect(databaseUrl)

connection
  .then(database => {
    logger.info(`Successfully connected to ${databaseUrl}`)
    return database;
  })
  .catch(error => {
    if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(databaseUrl);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(error);
    }
  })


export default connection;