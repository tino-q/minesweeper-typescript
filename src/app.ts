import 'module-alias/register';
import express from 'express';

import services from '~api/services';
import config from '~config';

import { expressLoader, swaggerLoader } from '~loaders';
import { ENVIRONMENTS } from '~constants';

const app = express();

if (config.environment !== ENVIRONMENTS.TESTING) {
  services.dynamodb.createTable(config.dynamodb.boardTableName).catch();
}

swaggerLoader(app);
expressLoader(app);

export default app;
