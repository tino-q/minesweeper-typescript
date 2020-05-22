/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import config from '~config';
import { ENVIRONMENTS } from '~constants';

const stubLogger = {
  info: (): void => {},
  error: (): void => {},
  warn: (): void => {}
};

const customLogger = {
  info: (i: any): void => console.log(JSON.stringify(i, null, 2)),
  error: (i: any): void => console.error(JSON.stringify(i, null, 2)),
  warn: (i: any): void => console.warn(JSON.stringify(i, null, 2)),
};

export default config.environment === ENVIRONMENTS.TESTING ? stubLogger : customLogger;
