import { SerializedHint } from '~api/serializers/hint';

export function testSerializedHint(arg: unknown): arg is SerializedHint {
  const hint = arg as SerializedHint;
  expect(hint).toBeDefined();
  expect(Number.isInteger(hint)).toBeTruthy();
  expect(hint).toBeGreaterThanOrEqual(0);
  return true;
}
