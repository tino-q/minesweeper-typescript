import { testSerializedHint } from './hint';
import { testSerializedPosition } from './position';

import { SerializedBoard } from '~api/serializers/board';
import { SerializedPosition } from '~api/serializers/position';
import { SerializedHint } from '~api/serializers/hint';

export function testSerializedBoard(arg: unknown): arg is SerializedBoard {
  const board = arg as SerializedBoard;
  expect(board && board.id && board.id.length).toBeTruthy();
  expect(board.won).toBeDefined();
  expect(board.rows).toBeDefined();
  expect(board.rows).toBeGreaterThanOrEqual(0);
  expect(board.columns).toBeDefined();
  expect(board.columns).toBeGreaterThanOrEqual(0);
  expect(board.difficulty).toBeDefined();
  expect(board.difficulty).toBeGreaterThanOrEqual(0);
  Object.keys(board.flags).map((flag: SerializedPosition) =>
    expect(testSerializedPosition(flag)).toBeTruthy()
  );
  Object.keys(board.questionMarks).map((questionMark: SerializedPosition) =>
  expect(testSerializedPosition(questionMark)).toBeTruthy()
);
  Object.entries(board.hints).map(([pos, hint]: [SerializedPosition, SerializedHint]) =>
    expect(testSerializedHint(hint) && testSerializedPosition(pos)).toBeTruthy()
  );
  expect(board.begin_epoch_ms).toBeDefined();
  expect(board.begin_epoch_ms).toBeGreaterThanOrEqual(0);
  return true;
}
