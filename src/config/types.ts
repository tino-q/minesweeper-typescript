interface APIConfig {
  prefix: string;
  baseUrl: string;
  port: number;
}

export interface DynamoDBConfig {
  boardTableRegion: string;
  boardTableName: string;
  boardTableEndpoint: string;
}

export interface Config {
  environment: string;
  api: APIConfig;
  dynamodb: DynamoDBConfig;
}
