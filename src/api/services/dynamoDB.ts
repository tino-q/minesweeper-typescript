import AWS from 'aws-sdk';

// import { serviceUnavailableError } from '~api/errors';
// import config from '~config';
import logger from '~libs/logger';

// const endpoint = 'http://localhost:8000';
const region = 'us-east-1';

const dynamoClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region
});

/* const aa = new AWS.DynamoDB({ endpoint, region });

const createBoardTableInput: AWS.DynamoDB.CreateTableInput = {
  TableName: 'boards',
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
};*/

// aa.createTable(createBoardTableInput, (err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput): void => {
//   console.log(data, err);
// });

// createBoardTableInput &&
//  aa.deleteTable({ TableName: 'boards' }, (err: AWS.AWSError, data: AWS.DynamoDB.DeleteTableOutput): void => {
//    console.log(data, err);
//  });

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
