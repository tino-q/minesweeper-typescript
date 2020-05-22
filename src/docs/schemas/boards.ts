import { uuid } from '~api/schemas/commons';

export default {
  Board: {
    type: 'object',
    properties: {
      id: uuid,
      rows: { type: 'number' },
      columns: { type: 'number' },
      elapsed_seconds: { type: 'number' },
      flags: { type: 'object', example: { 'x.y': true } },
      hints: { type: 'object', example: { 'x.y': 1 } }
    }
  }
};
