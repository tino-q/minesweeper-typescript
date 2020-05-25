import dynamoDBMocks from '~tests/mocks/dynamoDB';

import repositories from '~api/repositories';
import services from '~api/services';
import { buildBoard, Board } from '~api/models/board';
import { serializePosition, SerializedPosition } from '~api/serializers/position';
import { Position } from '~api/models/position';
import { getNeighbours } from '~api/services/boards';

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


describe('hint surrounded by eight mines should have value 8', () => {
  let updatedBoard: Board | null;
  const centerPosition: Position = { x: 1, y: 1};
  const mines: Record<SerializedPosition, true | undefined> = {
    [serializePosition({x: 0, y: 0})]: true,
    [serializePosition({x: 0, y: 1})]: true,
    [serializePosition({x: 0, y: 2})]: true,
    
    [serializePosition({x: 2, y: 0})]: true,
    [serializePosition({x: 2, y: 1})]: true,
    [serializePosition({x: 2, y: 2})]: true,

    [serializePosition({x: 1, y: 0})]: true,
    [serializePosition({x: 1, y: 2})]: true
  };
  
  const rows = 5;
  const columns = 5;
  const boardDraft: Board = buildBoard({ rows, columns, difficulty: 1 }, mines);
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const { id } = await repositories.boards.saveBoard(boardDraft);
    updatedBoard = await services.boards.revealPosition({position: centerPosition, boardId: id});
    return done();
  });
  test('explosionPos should be set to the revealed position', (done: jest.DoneCallback) => {
    expect(updatedBoard?.hints[serializePosition(centerPosition)]).toEqual({value: Object.keys(mines).length});
    done();
  });
});



describe('single mine in the center of the board', () => {
  let updatedBoard: Board | null;
  const centerPosition: Position = { x: 3, y: 3 };
  const mines: Record<SerializedPosition, true | undefined> = {
    [serializePosition(centerPosition)]: true,
  };
  const centerNeighbours = getNeighbours(centerPosition).map(serializePosition);
  const rows = 7;
  const columns = 7;
  const boardDraft: Board = buildBoard({ rows, columns, difficulty: 1 }, mines);
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const { id } = await repositories.boards.saveBoard(boardDraft);
    updatedBoard = await services.boards.revealPosition({position: {x: 0, y: 0}, boardId: id});
    return done();
  });
  test('Neighbours should have hints showing 1 mine', (done: jest.DoneCallback) => {
    centerNeighbours.forEach((pos: string) => expect(updatedBoard?.hints[pos]).toEqual({value: 1}));
    done();
  });

  test('all other positions should have hints of value 0', (done: jest.DoneCallback) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const pos = serializePosition({ x: j, y: i });
        if (
          (pos !== serializePosition(centerPosition)) &&
          !centerNeighbours.includes(pos)
        ) {
          expect(updatedBoard?.hints[pos]).toEqual({value: 0});
        }
      }
    }
    done();
  });
});

describe('flags should replace question marks and vice versa', () => {
  const targetPosition: Position = { x: 3, y: 3 };
  const rows = 7;
  const columns = 7;
  const boardDraft: Board = buildBoard({ rows, columns, difficulty: 0 });
  let boardWithFlag: Board;
  let boardWithQuestionMark: Board;
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const { id } = await repositories.boards.saveBoard(boardDraft);
    boardWithFlag = {...await services.boards.toggleFlag({ position: targetPosition, boardId: id})};
    boardWithQuestionMark = await services.boards.toggleQuestionMark({ position: targetPosition, boardId: id});
    return done();
  });

  test('board with flag should have a flag at target position', (done: jest.DoneCallback) => {
    expect(boardWithFlag?.flags[serializePosition(targetPosition)]).toBeTruthy();
    done();
  });

  test('board with flag should have no question mark at target position', (done: jest.DoneCallback) => {
    expect(boardWithFlag?.questionMarks[serializePosition(targetPosition)]).toBeUndefined();
    done();
  });

  test('board with question mark should have a question mark at target position', (done: jest.DoneCallback) => {
    expect(boardWithQuestionMark?.questionMarks[serializePosition(targetPosition)]).toBeTruthy();
    done();
  });

  test('board with question mark should have no flag at target position', (done: jest.DoneCallback) => {
    expect(boardWithQuestionMark?.flags[serializePosition(targetPosition)]).toBeUndefined();
    done();
  });
});

describe('winning the game', () => {
  let updatedBoard: Board | null;
  const topLeftPosition: Position = { x: 0, y: 0 };
  const mines: Record<SerializedPosition, true | undefined> = {
    [serializePosition(topLeftPosition)]: true,
  };
  const rows = 5;
  const columns = 5;
  const boardDraft: Board = buildBoard({ rows, columns, difficulty: 1 }, mines);
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const { id } = await repositories.boards.saveBoard(boardDraft);
    await services.boards.revealPosition({position: {x: columns - 1, y: rows - 1}, boardId: id});
    updatedBoard = await services.boards.toggleFlag({position: topLeftPosition, boardId: id});
    return done();
  });
  test('board.won should be true', (done: jest.DoneCallback) => {
    expect(updatedBoard?.won).toBeTruthy();
    done();
  });
});
