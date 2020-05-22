import { inspect } from 'util';

import app from './app';

import config from '~config';
import logger from '~libs/logger';

const PORT = config.api.port;

(function startServer(): void {
  try {
    app.listen(PORT);
    logger.info(`Server listening on port ${PORT} ☕︎`);
  } catch (error) {
    logger.error(inspect(error));
  }
})();
