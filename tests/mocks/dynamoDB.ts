/* eslint-disable @typescript-eslint/no-explicit-any */

let store = {};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: jest.fn((i: any) => ({
        promise: (): Promise<object> => Promise.resolve({ Item: store[i.Key.id] })
      })),
      put: jest.fn((i: any) => ({
        promise: (): Promise<object> => {
          store[i.Item.id] = i.Item;
          return Promise.resolve({});
        }
      }))
    }))
  },
}));

const clearStore = (): void => {
  store = {};
};

export default { clearStore };
