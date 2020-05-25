import { uuid } from './commons';

import { BOARD_MAX_ROWS, BOARD_MAX_COLUMNS, BOARD_MIN_COLUMNS, BOARD_MIN_ROWS } from '~constants';

export const getBoardSchema = {
  params: {
    type: 'object',
    required: ['board_id'],
    properties: {
      board_id: {
        type: 'string',
      }
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
      columns: COLUMN,
      difficulty: {
        type: 'number',
        example: 5,
        min: 1,
        max: 100
      }
    }
  }
};

export const boardPositionSchema = {
  params: {
    type: 'object',
    required: ['board_id'],
    properties: {
      board_id: { type: 'string' }
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

export const saveBoardByTagSchema = {
  params: {
    type: 'object',
    required: ['board_id', 'board_tag'],
    properties: {
      board_id: uuid,
      board_tag: {
        type: 'string'
      }
    }
  },
};