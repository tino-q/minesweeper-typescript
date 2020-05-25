/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamoDBMocks from '~tests/mocks/dynamoDB';

import request from 'supertest';
import { v4 } from 'uuid';

import app from '~app';
import { testSerializedBoard } from '~tests/serializations/board';
import {
  STATUS_CODES,
  BOARD_DEFAULT_COLUMNS,
  BOARD_DEFAULT_ROWS,
  BOARD_MAX_ROWS,
  BOARD_MAX_COLUMNS,
  BOARD_MIN_ROWS,
  BOARD_MIN_COLUMNS
} from '~constants';
import { SerializedBoard } from '~api/serializers/board';
import repositories from '~api/repositories';
import services from '~api/services';
import { INVALID_SCHEMA, INVALID_POSITION_FOR_BOARD, POSITION_HAS_HINT_ERROR } from '~api/errors';
import { buildBoard, Board } from '~api/models/board';
import { serializePosition, SerializedPosition } from '~api/serializers/position';
import { getRandomPosition, Position } from '~api/models/position';
import { CreateBoardParams } from '~api/mappers/boards';

const getRandomTestPosition = (): Position => getRandomPosition(BOARD_MAX_ROWS, BOARD_MAX_COLUMNS);

const getTestBoard = (mines?: Record<SerializedPosition, true | undefined>): Board =>
  buildBoard({
    rows: BOARD_MAX_ROWS,
    columns: BOARD_MAX_COLUMNS,
    difficulty: 50
  }, mines);

describe('POST /boards', () => {
  describe('Without parameters', () => {
    let board: SerializedBoard;
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      dynamoDBMocks.clearStore();
      response = await request(app).post('/boards');
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.CREATED}`, () => {
      expect(response.status).toBe(STATUS_CODES.CREATED);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
    test(`board should have ${BOARD_DEFAULT_COLUMNS} columns`, () => {
      expect(board.columns).toBe(BOARD_DEFAULT_COLUMNS);
    });
    test(`board should have ${BOARD_DEFAULT_ROWS} rows`, () => {
      expect(board.rows).toBe(BOARD_DEFAULT_ROWS);
    });
  });

  describe('with parameters', () => {
    describe('correct ones', () => {
      let board: SerializedBoard;
      let response: request.Response;
      afterAll(() => dynamoDBMocks.clearStore());
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app)
          .post('/boards')
          .send({ rows: BOARD_MAX_ROWS - 1, columns: BOARD_MAX_COLUMNS - 1 });
        board = response.body;
        return done();
      });
      test(`status code should be ${STATUS_CODES.CREATED}`, () => {
        expect(response.status).toBe(STATUS_CODES.CREATED);
      });
      test('body should be the serialized board', () => {
        expect(testSerializedBoard(board)).toBeTruthy();
      });
      test(`board should have ${BOARD_MAX_COLUMNS - 1} columns`, () => {
        expect(board.columns).toBe(BOARD_MAX_COLUMNS - 1);
      });
      test(`board should have ${BOARD_MAX_ROWS - 1} rows`, () => {
        expect(board.rows).toBe(BOARD_MAX_ROWS - 1);
      });
    });
    describe('negative ones', () => {
      let board: SerializedBoard;
      let response: request.Response;
      afterAll(() => dynamoDBMocks.clearStore());
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app)
          .post('/boards')
          .send({ rows: -BOARD_MAX_ROWS, columns: -BOARD_MAX_COLUMNS });
        board = response.body;
        return done();
      });
      test(`status code should be ${STATUS_CODES.CREATED}`, () => {
        expect(response.status).toBe(STATUS_CODES.CREATED);
      });
      test('body should be the serialized board', () => {
        expect(testSerializedBoard(board)).toBeTruthy();
      });
      test(`board should have ${BOARD_DEFAULT_COLUMNS} columns`, () => {
        expect(board.columns).toBe(BOARD_DEFAULT_COLUMNS);
      });
      test(`board should have ${BOARD_DEFAULT_ROWS} rows`, () => {
        expect(board.rows).toBe(BOARD_DEFAULT_COLUMNS);
      });
    });

    
    describe('too large ones', () => {
      let board: SerializedBoard;
      let response: request.Response;
      afterAll(() => dynamoDBMocks.clearStore());
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app)
          .post('/boards')
          .send({ rows: 2 * BOARD_MAX_ROWS, columns: 2 * BOARD_MAX_COLUMNS });
        board = response.body;
        return done();
      });
      test(`status code should be ${STATUS_CODES.CREATED}`, () => {
        expect(response.status).toBe(STATUS_CODES.CREATED);
      });
      test('body should be the serialized board', () => {
        expect(testSerializedBoard(board)).toBeTruthy();
      });
      test(`board should have ${BOARD_DEFAULT_COLUMNS} columns`, () => {
        expect(board.columns).toBe(BOARD_DEFAULT_COLUMNS);
      });
      test(`board should have ${BOARD_DEFAULT_ROWS} rows`, () => {
        expect(board.rows).toBe(BOARD_DEFAULT_COLUMNS);
      });
    });
  });

  describe('invalid params', () => {
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      response = await request(app)
        .post('/boards')
        .send({ rows: 'abc', columns: 'asd' });
      return done();
    });
    test(`status code should be ${STATUS_CODES.UNPROCESSABLE_ENTITY}`, () => {
      expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    });
    test(`internal code should be ${INVALID_SCHEMA}`, () => {
      expect(response.body.internal_code).toBe(INVALID_SCHEMA);
    });
    test('should tell us that rows need to be numbers ', () => {
      expect(
        response.body.errors.find((error: Error) => error.message === '/body/rows: should be number')
      ).toBeTruthy();
    });
    test('should tell us that columns need to be numbers ', () => {
      expect(
        response.body.errors.find((error: Error) => error.message === '/body/columns: should be number')
      ).toBeTruthy();
    });
  }); 
});

describe('GET /boards/:board_id', () => {

  describe('with a non existent uuid v4', () => {
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      response = await request(app).get(`/boards/${v4()}`);
      return done();
    });
    test(`status code should be ${STATUS_CODES.NOT_FOUND}`, () => {
      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    });
  });

  describe('requesting a existent id', () => {
    let board: SerializedBoard;
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b = await repositories.boards.saveBoard(getTestBoard());
      response = await request(app).get(`/boards/${b.id}`);
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
  });
});



describe('PUT /boards/:board_id/toggle_flag', () => {
  const INVALID_PAYLOADS = [
    {},
    { row: BOARD_MIN_ROWS + 1 },
    { column: BOARD_MIN_COLUMNS + 1 },
    { row: BOARD_MIN_ROWS - 1, columns: BOARD_MIN_COLUMNS + 1 },
    { row: BOARD_MIN_ROWS + 1, columns: BOARD_MIN_COLUMNS - 1 },
    { row: BOARD_MAX_ROWS + 1, columns: BOARD_MAX_COLUMNS - 1 },
    { row: BOARD_MAX_ROWS - 1, columns: BOARD_MAX_COLUMNS + 1 }
  ];
  describe.each(INVALID_PAYLOADS)('schema error', (payload: object) => {
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeEach(async () => {
      response = await request(app)
        .put(`/boards/${v4()}/toggle_flag`)
        .send(payload);
    });

    test(`should match status code ${STATUS_CODES.UNPROCESSABLE_ENTITY}`, () => {
      expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
    });
    test('should serialize the error', () => {
      expect(response.body.internal_code).toBe(INVALID_SCHEMA);
    });
  });

  describe('sets a flag', () => {
    let board: SerializedBoard;
    let response: request.Response;
    const flagPosition = getRandomTestPosition();
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b = await repositories.boards.saveBoard(getTestBoard());
      response = await request(app)
        .put(`/boards/${b.id}/toggle_flag`)
        .send({
          row: flagPosition.y,
          column: flagPosition.x
        });
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
    test(`there should be a flag at (${serializePosition(flagPosition)}) on the updated board`, () => {
      expect(board.flags[serializePosition(flagPosition)]).toBeTruthy();
    });
  });

  describe('unsets a flag', () => {
    let draft: Board;
    let board: SerializedBoard;
    let response: request.Response;
    const flagPosition = getRandomTestPosition();
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      draft = getTestBoard();
      draft.flags[serializePosition(flagPosition)] = true;
      const b = await repositories.boards.saveBoard(draft);
      response = await request(app)
        .put(`/boards/${b.id}/toggle_flag`)
        .send({
          row: flagPosition.y,
          column: flagPosition.x
        });
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
    test(`there should be a flag at (${serializePosition(flagPosition)}) on the draft`, () => {
      expect(draft.flags[serializePosition(flagPosition)]).toBeTruthy();
    });
    test(`there should not be a flag at (${serializePosition(flagPosition)}) on the updated board`, () => {
      expect(board.flags[serializePosition(flagPosition)]).toBeFalsy();
    });
  });

  describe('toggles a flag', () => {
    let boardWithFlag: SerializedBoard;
    let boardWithoutFlag: SerializedBoard;
    const flagPosition = getRandomTestPosition();
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const { id } = await repositories.boards.saveBoard(getTestBoard());
      let response = await request(app)
        .put(`/boards/${id}/toggle_flag`)
        .send({
          row: flagPosition.y,
          column: flagPosition.x
        });
      boardWithFlag = response.body;
      response = await request(app)
        .put(`/boards/${id}/toggle_flag`)
        .send({
          row: flagPosition.y,
          column: flagPosition.x
        });
      boardWithoutFlag = response.body;
      return done();
    });
    test('both boards should be serialized boards', () => {
      expect(testSerializedBoard(boardWithoutFlag) && testSerializedBoard(boardWithFlag)).toBeTruthy();
    });
    test(`there should be a flag at (${serializePosition(flagPosition)}) on the draft`, () => {
      expect(boardWithFlag.flags[serializePosition(flagPosition)]).toBeTruthy();
    });
    test(`there should not be a flag at (${serializePosition(flagPosition)}) on the updated board`, () => {
      expect(boardWithoutFlag.flags[serializePosition(flagPosition)]).toBeFalsy();
    });
  });

  describe('when setting a flag on a position which has a hint', () => {
    let response: request.Response;
    let hintPosition: Position;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const draftBoard: Board = getTestBoard();
      let setHint = false;
      while (!setHint) {
        hintPosition = getRandomTestPosition();
        if (!draftBoard.mines[serializePosition(hintPosition)]) {
          draftBoard.hints[serializePosition(hintPosition)] = { value: 5 };
          setHint = true;
        }
      }

      const b: Board = await repositories.boards.saveBoard(draftBoard);
      response = await request(app)
        .put(`/boards/${b.id}/toggle_flag`)
        .send({
          row: hintPosition.y,
          column: hintPosition.x
        });
      return done();
    });
    test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    });
    test(`internal code should be ${POSITION_HAS_HINT_ERROR}`, () => {
      expect(response.body.internal_code).toBe(POSITION_HAS_HINT_ERROR);
    });
  });

  describe('on set flag outside board', () => {
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b: Board = await repositories.boards.saveBoard(getTestBoard());
      response = await request(app)
        .put(`/boards/${b.id}/toggle_flag`)
        .send({
          row: b.rows + 1,
          column: b.columns + 1
        });
      return done();
    });
    test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    });
    test(`internal code should be ${INVALID_POSITION_FOR_BOARD}`, () => {
      expect(response.body.internal_code).toBe(INVALID_POSITION_FOR_BOARD);
    });
  });
});

describe('PUT /boards/:board_id/reveal', () => {
  describe('Should get board.columns * board.rows - 1 hints with only one placed mine on the top left corner', () => {
    let response: request.Response;
    let board: Board | null;
    const revealedPosition: Position = { x: 4, y: 4 };
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const { id } = await repositories.boards.saveBoard(
        getTestBoard({
          [serializePosition({ x: 0, y: 0 })]: true
        })
      );
      response = await request(app)
        .put(`/boards/${id}/reveal`)
        .send({
          row: revealedPosition.y,
          column: revealedPosition.x
        });
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('board should have a 0 hint on the revealead position', () => {
      expect(board?.hints[serializePosition(revealedPosition)]).toBe(0);
    });
    test('board should have board.columns * board.rows - 1 hints revealed', () => {
      expect(Object.values(board?.hints || {}).length).toBe(((board?.columns || 0) * (board?.rows || 0)) - 1);
    });
  });
});

describe('PUT /boards/:board_id/toggle_question', () => {
  describe('sets a question mark', () => {
    let board: SerializedBoard;
    let response: request.Response;
    const questionMarkPosition = getRandomTestPosition();
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b = await repositories.boards.saveBoard(getTestBoard());
      response = await request(app)
        .put(`/boards/${b.id}/toggle_question`)
        .send({
          row: questionMarkPosition.y,
          column: questionMarkPosition.x
        });
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
    test(`there should be a question mark at (${serializePosition(questionMarkPosition)}) on the updated board`, () => {
      expect(board.questionMarks[serializePosition(questionMarkPosition)]).toBeTruthy();
    });
  });


  describe('unsets a question mark', () => {
    let draft: Board;
    let board: SerializedBoard;
    let response: request.Response;
    const questionMarkPosition = getRandomTestPosition();
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      draft = getTestBoard();
      draft.questionMarks[serializePosition(questionMarkPosition)] = true;
      const b = await repositories.boards.saveBoard(draft);
      response = await request(app)
        .put(`/boards/${b.id}/toggle_question`)
        .send({
          row: questionMarkPosition.y,
          column: questionMarkPosition.x
        });
      board = response.body;
      return done();
    });
    test(`status code should be ${STATUS_CODES.OK}`, () => {
      expect(response.status).toBe(STATUS_CODES.OK);
    });
    test('body should be the serialized board', () => {
      expect(testSerializedBoard(board)).toBeTruthy();
    });
    test(`there should be a question mark at (${serializePosition(questionMarkPosition)}) on the draft`, () => {
      expect(draft.questionMarks[serializePosition(questionMarkPosition)]).toBeTruthy();
    });
    test(`there should not be a question mark at (${serializePosition(questionMarkPosition)}) on the updated board`, () => {
      expect(board.questionMarks[serializePosition(questionMarkPosition)]).toBeFalsy();
    });
  });

  describe('when setting a question mark on a position which has a hint', () => {
    let response: request.Response;
    let hintPosition: Position;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const draftBoard: Board = getTestBoard();
      let setHint = false;
      while (!setHint) {
        hintPosition = getRandomTestPosition();
        if (!draftBoard.mines[serializePosition(hintPosition)]) {
          draftBoard.hints[serializePosition(hintPosition)] = { value: 5 };
          setHint = true;
        }
      }

      const b: Board = await repositories.boards.saveBoard(draftBoard);
      response = await request(app)
        .put(`/boards/${b.id}/toggle_question`)
        .send({
          row: hintPosition.y,
          column: hintPosition.x
        });
      return done();
    });
    test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    });
    test(`internal code should be ${POSITION_HAS_HINT_ERROR}`, () => {
      expect(response.body.internal_code).toBe(POSITION_HAS_HINT_ERROR);
    });
  });

  describe('on set question mark outside board', () => {
    let response: request.Response;
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b: Board = await repositories.boards.saveBoard(getTestBoard());
      response = await request(app)
        .put(`/boards/${b.id}/toggle_question`)
        .send({
          row: b.rows + 1,
          column: b.columns + 1
        });
      return done();
    });
    test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    });
    test(`internal code should be ${INVALID_POSITION_FOR_BOARD}`, () => {
      expect(response.body.internal_code).toBe(INVALID_POSITION_FOR_BOARD);
    });
  });

});

describe('PUT /:board_id/save/:board_tag', () => {
  describe('saves a board by a tag', () => {
    let response: request.Response;
    const saveTag = 'mySavedBoard';
    const createParams: CreateBoardParams = { rows: 10, columns: 10, difficulty: 10 };
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b = await services.boards.createBoard(createParams);
      response = await request(app).put(`/boards/${b.id}/save/${saveTag}`);
      return done();
    });
    test(`status code should be ${STATUS_CODES.CREATED}`, () => {
      expect(response.status).toBe(STATUS_CODES.CREATED);
    });
  });

  describe('returns 400 on trying to save with an already used tag', () => {
    let saveOkResponse: request.Response;
    let conflictResponse: request.Response;
    const saveTag = 'mySavedBoard2';
    const createParams: CreateBoardParams = { rows: 10, columns: 10, difficulty: 10 };
    afterAll(() => dynamoDBMocks.clearStore());
    beforeAll(async (done: jest.DoneCallback) => {
      const b1 = await services.boards.createBoard(createParams);
      const b2 = await services.boards.createBoard(createParams);
      saveOkResponse = await request(app).put(`/boards/${b1.id}/save/${saveTag}`);
      conflictResponse = await request(app).put(`/boards/${b2.id}/save/${saveTag}`);
      return done();
    });
    test(`status code should be ${STATUS_CODES.CREATED} for saveOkResponse`, () => {
      expect(saveOkResponse.status).toBe(STATUS_CODES.CREATED);
    });
    test(`status code should be ${STATUS_CODES.BAD_REQUEST} for conflictResponse`, () => {
      expect(conflictResponse.status).toBe(STATUS_CODES.BAD_REQUEST);
    });
  });
});


describe('unsets a question mark', () => {
  let draft: Board;
  let board: SerializedBoard;
  let response: request.Response;
  const questionMarkPosition = getRandomTestPosition();
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    draft = getTestBoard();
    draft.questionMarks[serializePosition(questionMarkPosition)] = true;
    const b = await repositories.boards.saveBoard(draft);
    response = await request(app)
      .put(`/boards/${b.id}/toggle_question`)
      .send({
        row: questionMarkPosition.y,
        column: questionMarkPosition.x
      });
    board = response.body;
    return done();
  });
  test(`status code should be ${STATUS_CODES.OK}`, () => {
    expect(response.status).toBe(STATUS_CODES.OK);
  });
  test('body should be the serialized board', () => {
    expect(testSerializedBoard(board)).toBeTruthy();
  });
  test(`there should be a question mark at (${serializePosition(questionMarkPosition)}) on the draft`, () => {
    expect(draft.questionMarks[serializePosition(questionMarkPosition)]).toBeTruthy();
  });
  test(`there should not be a question mark at (${serializePosition(questionMarkPosition)}) on the updated board`, () => {
    expect(board.questionMarks[serializePosition(questionMarkPosition)]).toBeFalsy();
  });
});

describe('when setting a question mark on a position which has a hint', () => {
  let response: request.Response;
  let hintPosition: Position;
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const draftBoard: Board = getTestBoard();
    let setHint = false;
    while (!setHint) {
      hintPosition = getRandomTestPosition();
      if (!draftBoard.mines[serializePosition(hintPosition)]) {
        draftBoard.hints[serializePosition(hintPosition)] = { value: 5 };
        setHint = true;
      }
    }

    const b: Board = await repositories.boards.saveBoard(draftBoard);
    response = await request(app)
      .put(`/boards/${b.id}/toggle_question`)
      .send({
        row: hintPosition.y,
        column: hintPosition.x
      });
    return done();
  });
  test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });
  test(`internal code should be ${POSITION_HAS_HINT_ERROR}`, () => {
    expect(response.body.internal_code).toBe(POSITION_HAS_HINT_ERROR);
  });
});

describe('on set question mark outside board', () => {
  let response: request.Response;
  afterAll(() => dynamoDBMocks.clearStore());
  beforeAll(async (done: jest.DoneCallback) => {
    const b: Board = await repositories.boards.saveBoard(getTestBoard());
    response = await request(app)
      .put(`/boards/${b.id}/toggle_question`)
      .send({
        row: b.rows + 1,
        column: b.columns + 1
      });
    return done();
  });
  test(`status code should be ${STATUS_CODES.BAD_REQUEST}`, () => {
    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
  });
  test(`internal code should be ${INVALID_POSITION_FOR_BOARD}`, () => {
    expect(response.body.internal_code).toBe(INVALID_POSITION_FOR_BOARD);
  });
});

