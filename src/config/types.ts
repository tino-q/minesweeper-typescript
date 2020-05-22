interface APIConfig {
  prefix: string;
  baseUrl: string;
  port: number;
}

export interface DynamoDBConfig {
  endpoint: string;
  region: string;
}

export interface Config {
  environment: string;
  api: APIConfig;
  dynamodb: DynamoDBConfig;
}
