import { uuid } from '~api/schemas/commons';

export default {
  Board: {
    type: 'object',
    properties: {
      id: uuid,
      rows: { type: 'number', example: 1 },
      columns: { type: 'number', example: 1 },
      difficulty: { type: 'number', example: 1 },
      elapsed_seconds: { type: 'number' },
      flags: { type: 'object', example: { 'x.y': true } },
      questionMarks: { type: 'object', example: { 'x.y': true } },
      hints: { type: 'object', example: { 'x.y': 1 } }
    }
  }
};
