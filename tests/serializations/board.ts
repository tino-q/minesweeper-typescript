import { testSerializedHint } from './hint';
import { testSerializedPosition } from './position';

import { SerializedBoard } from '~api/serializers/board';
import { uuidv4regExp } from '~tests/helpers';
import { SerializedPosition } from '~api/serializers/position';
import { SerializedHint } from '~api/serializers/hint';

export function testSerializedBoard(arg: unknown): arg is SerializedBoard {
  const board = arg as SerializedBoard;
  expect(board && board.id && board.id.match(uuidv4regExp)).toBeTruthy();
  expect(board.rows).toBeDefined();
  expect(board.rows).toBeGreaterThanOrEqual(0);
  expect(board.columns).toBeDefined();
  expect(board.columns).toBeGreaterThanOrEqual(0);
  Object.keys(board.flags).map((flag: SerializedPosition) =>
    expect(testSerializedPosition(flag)).toBeTruthy()
  );
  Object.entries(board.hints).map(([pos, hint]: [SerializedPosition, SerializedHint]) =>
    expect(testSerializedHint(hint) && testSerializedPosition(pos)).toBeTruthy()
  );
  expect(board.begin_epoch_ms).toBeDefined();
  expect(board.begin_epoch_ms).toBeGreaterThanOrEqual(0);
  return true;
}
