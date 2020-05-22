import { uuid } from './commons';

import { BOARD_MAX_ROWS, BOARD_MAX_COLUMNS, BOARD_MIN_COLUMNS, BOARD_MIN_ROWS } from '~constants';

export const getBoardSchema = {
  params: {
    type: 'object',
    required: ['board_id'],
    properties: {
      board_id: uuid
    }
  }
};

const ROW = {
  type: 'number',
  min: BOARD_MIN_ROWS,
  max: BOARD_MAX_ROWS,
  example: 5
};

const COLUMN = {
  type: 'number',
  min: BOARD_MIN_COLUMNS,
  max: BOARD_MAX_COLUMNS,
  example: 5
};

export const createBoardSchema = {
  body: {
    type: 'object',
    required: [],
    properties: {
      rows: ROW,
      columns: COLUMN
    }
  }
};

export const boardPositionSchema = {
  params: {
    type: 'object',
    required: ['board_id'],
    properties: {
      board_id: uuid
    }
  },
  body: {
    type: 'object',
    required: ['row', 'column'],
    properties: {
      row: ROW,
      column: COLUMN
    }
  }
};

export const revealPositionSchema = boardPositionSchema;

export const toggleFlagSchema = boardPositionSchema;
