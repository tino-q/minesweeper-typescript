import AWS from 'aws-sdk';

import config from '~config';
import logger from '~libs/logger';
import { DynamoDBConfig } from '~config/types';

const awsConfig = (): DynamoDBConfig => ({
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region
});

const dynamoClient = new AWS.DynamoDB.DocumentClient(awsConfig());

export async function getValue<T>(table: string, key: string): Promise<T | null> {
  logger.info(`Start to get value in table: "${table}" with key: "${key}"`);
  const result = await dynamoClient.get({ TableName: table, Key: { id: key } }).promise();
  logger.info(`Finish to get value from table: "${table}"`);
  if (!result.Item) return null;
  return result.Item as T;
}

export async function putValue<T>(table: string, key: string, object: T): Promise<void> {
  logger.info(`Start to set value in table: "${table}" with key: "${key}"`);
  await dynamoClient.put({ TableName: table, Item: { id: key, ...object } }).promise();
  logger.info(`Finish to set value in table: "${table}" with key: "${key}"`);
}

export async function putGetValue<T>(table: string, key: string, object: T): Promise<T | null> {
  await putValue(table, key, object);
  return getValue(table, key);
}


export async function createTable (TableName: string): Promise<void> {
  return new Promise((resolve: () => void, reject: (err: Error) => void) => {
    const client = new AWS.DynamoDB(awsConfig());
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
    const client = new AWS.DynamoDB(awsConfig());
    client.deleteTable({ TableName }, (err: AWS.AWSError) => (err) ? reject(err) : resolve());
  });
}


