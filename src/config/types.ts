interface APIConfig {
  prefix: string;
  baseUrl: string;
  port: number;
}

export interface Config {
  environment: string;
  api: APIConfig;
}
