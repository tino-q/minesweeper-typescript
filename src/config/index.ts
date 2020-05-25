import { Config } from './types';

import { ENVIRONMENTS } from '../constants';

require('dotenv').config();

const generateConfig = (): Config => {
  const missingKeys: string[] = [];
  const getEnvVar = (key: string, defaultValue?: string): string => {
    if (!process.env[key] && defaultValue === undefined) {
      missingKeys.push(key);
    }
    return (process.env[key] || defaultValue) as string;
  };

  const environment = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;

  const config: Config = {
    environment,
    api: {
      baseUrl: getEnvVar('API_BASE_URL', 'http://localhost:8080'),
      prefix: '/',
      port: Number(getEnvVar('PORT', '8080'))
    },
    dynamodb: {
      boardTableEndpoint: getEnvVar('BOARD_TABLE_ENDPOINT', ''),
      boardTableName: getEnvVar('BOARD_TABLE_NAME', 'boards'),
      boardTableRegion: getEnvVar('BOARD_TABLE_REGION', 'us-east-1'),
    }
  };
  if (missingKeys.length) {
    throw new Error(`The following environment variables are missing: ${missingKeys}`);
  }
  return config;
};

export default generateConfig();
