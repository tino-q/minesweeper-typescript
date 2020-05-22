/* eslint-disable @typescript-eslint/no-empty-function */
import config from '~config';
import { ENVIRONMENTS } from '~constants';

const stubLogger = {
  info: (): void => {},
  error: (): void => {},
  warn: (): void => {}
};

export default config.environment === ENVIRONMENTS.TESTING ? stubLogger : console;
