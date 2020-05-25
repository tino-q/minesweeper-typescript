import dynamoDBMocks from '~tests/mocks/dynamoDB';

import repositories from '~api/repositories';
import services from '~api/services';
import { buildBoard, Board } from '~api/models/board';
import { serializePosition, SerializedPosition } from '~api/serializers/position';
import { Position } from '~api/models/position';

describe('play a game', () => {
  describe('should reveal all squares minus the only mine', () => {
    let updatedBoard: Board | null;
    const rows = 5;
    const columns = 5;
    const mines: Record<SerializedPosition, true | undefined> = {
      [serializePosition({ x: 0, y: 0 })]: true
    };
    const boardDraft: Board = buildBoard({ rows, columns, difficulty: 1 }, mines);
    const revealedPosition: Position = { x: 4, y: 4 };
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const { id } = await repositories.boards.saveBoard(boardDraft);
      updatedBoard = await services.boards.revealPosition({position: revealedPosition, boardId: id});
      return done();
    });
    test('board should have hints everywhere except at (0,0) where the only mine is', (done: jest.DoneCallback) => {
      for (let x = 0; x < columns; x ++) {
        for (let y = 0; y < rows; y++) {
          if (x === 0 && y === 0) {
            expect(updatedBoard?.mines[serializePosition({x, y})]).toBeDefined();
          } else {
            expect(updatedBoard?.hints[serializePosition({x, y})]).toBeDefined();
          }
        }
      }
      done();
    });

    test('neighbours to 0,0 should have hint set to 1', (done: jest.DoneCallback) => {
      const right = serializePosition({x: 1, y: 0});
      const down = serializePosition({x: 0, y: 1});
      const downRight = serializePosition({x: 1, y: 1});
      [right, down, downRight].forEach((pos: SerializedPosition) =>
        expect(updatedBoard?.hints[pos]).toEqual({ value: 1 }));
      done();
    });
  });
});

describe('end a game', () => {
  describe('should return an explosion position set to the revealed mine', () => {
    let updatedBoard: Board | null;
    const minePosition = {x: 2, y: 2};
    const mines: Record<SerializedPosition, true | undefined> = {
      [serializePosition(minePosition)]: true
    };
    
    const rows = 5;
    const columns = 5;
    const boardDraft: Board = buildBoard({ rows, columns, difficulty: 1 }, mines);
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const { id } = await repositories.boards.saveBoard(boardDraft);
      updatedBoard = await services.boards.revealPosition({position: minePosition, boardId: id});
      return done();
    });
    test('explosionPos should be set to the revealed position', (done: jest.DoneCallback) => {
      expect(updatedBoard?.explosionPos).toEqual(minePosition);
      done();
    });
    test('The board should now show us the mines that were on the board', (done: jest.DoneCallback) => {
      expect(updatedBoard?.mines).toEqual(mines);
      done();
    });
  });
});