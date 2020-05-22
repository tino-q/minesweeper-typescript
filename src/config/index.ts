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
      baseUrl: getEnvVar('API_BASE_URL'),
      prefix: '/',
      port: Number(getEnvVar('PORT', '8080'))
    },
    dynamodb: {
      region: getEnvVar('DYNAMO_DB_REGION'),
      endpoint: getEnvVar('DYNAMO_DB_ENDPOINT')
    }
  };
  if (missingKeys.length) {
    throw new Error(`The following environment variables are missing: ${missingKeys}`);
  }
  return config;
};

export default generateConfig();
