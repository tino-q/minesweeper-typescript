import AWS from 'aws-sdk';

import logger from '~libs/logger';
import config from '~config';

const awsCfg = {
  endpoint: config.dynamodb.boardTableEndpoint || undefined,
  region: config.dynamodb.boardTableRegion,
};

const dynamoClient = new AWS.DynamoDB.DocumentClient(awsCfg);

const table = config.dynamodb.boardTableName;


export async function getValue<T>(key: string): Promise<T | null> {
  logger.info(`Start to get value in table: "${table}" with key: "${key}"`);
  const result = await dynamoClient.get({ TableName: table, Key: { id: key } }).promise();
  logger.info(`Finish to get value from table: "${table}"`);
  if (!result.Item) return null;
  return result.Item as T;
}

async function putValue<T>(key: string, object: T, secondsToLive: number): Promise<void> {
  logger.info(`Start to set value in table: "${table}" with key: "${key}"`);
  const ttl = Date.now() + (secondsToLive * 1000);
  await dynamoClient.put({ TableName: table, Item: { id: key, ...object, ttl } }).promise();
  logger.info(`Finish to set value in table: "${table}" with key: "${key}"`);
}


export async function putGetValue<T>(key: string, object: T, secondsToLive: number): Promise<T | null> {
  await putValue(key, object, secondsToLive);
  return getValue(key);
}

export async function createTable (TableName: string): Promise<void> {
  return new Promise((resolve: () => void, reject: (err: Error) => void) => {
    const client = new AWS.DynamoDB(awsCfg);
    client.createTable({
      TableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }, (err: AWS.AWSError) => (err) ? reject(err) : resolve());
  });
}

export async function deleteTable(TableName: string): Promise<void> {
  return new Promise((resolve: () => void, reject: (err: Error) => void) => {
    const client = new AWS.DynamoDB(awsCfg);
    client.deleteTable({ TableName }, (err: AWS.AWSError) => (err) ? reject(err) : resolve());
  });
}
