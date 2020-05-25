import {
  BOARD_MAX_ROWS,
  BOARD_MIN_COLUMNS,
  BOARD_MAX_COLUMNS,
  BOARD_MIN_ROWS,
  BOARD_DEFAULT_COLUMNS,
  BOARD_DEFAULT_ROWS,
  BOARD_DEFAULT_DIFFICULTY
} from '~constants';

export default {
  Board: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      },
      rows: {
        type: 'number',
        description: 'amount of rows in the board',
        example: BOARD_DEFAULT_ROWS,
        min: BOARD_MIN_ROWS,
        max: BOARD_MAX_ROWS
      },
      columns: {
        type: 'number',
        description: 'amount of columns in the board',
        example: BOARD_DEFAULT_COLUMNS,
        min: BOARD_MIN_COLUMNS,
        max: BOARD_MAX_COLUMNS
      },
      difficulty: {
        type: 'number',
        example: BOARD_DEFAULT_DIFFICULTY,
        min: 0,
        max: 100
      },
      elapsed_seconds: {
        description: "Elapsed seconds since the creation of the board",
        example: 2389,
        type: 'number'
      },
      flags: {
        description: "Object where the keys are the serialized positions of the flags",
        type: 'object',
        example: { '12.2': true }
      },
      questionMarks: {
        description: "Object where the keys are the serialized positions of the question marks",
        type: 'object',
        example: { '1.6': true }
      },
      hints: {
        description: "Object where the keys are the serialized positions of the hints",
        type: 'object',
        example: { '0.0': { value: 10 } }
      }
    }
  }
};