import { isSerializedPosition, SerializedPosition } from '~api/serializers/position';

export function testSerializedPosition(arg: unknown): arg is SerializedPosition {
  const position = arg as SerializedPosition;
  expect(isSerializedPosition(position)).toBeTruthy();
  return true;
}
