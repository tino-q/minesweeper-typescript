import { generateErrorResponses, getSwaggerParameters } from '../utils';
import * as Tags from '../tags';

import {
  boardNotFoundError,
  positionHasHintError,
  invalidPositionForBoard,
  invalidBoardError
} from '~api/errors';
import { STATUS_CODES } from '~constants';
import { createBoardSchema, toggleFlagSchema } from '~api/schemas';

export default {
  '/boards': {
    post: {
      tags: [Tags.BOARDS],
      description: 'Creates a new board!',
      operationId: 'createBoard',
      parameters: getSwaggerParameters(createBoardSchema),
      responses: {
        [STATUS_CODES.CREATED]: {
          description: 'The board',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Board' }
            }
          }
        },
        ...generateErrorResponses()
      }
    }
  },
  '/boards/:board_id': {
    get: {
      tags: [Tags.BOARDS],
      description: 'Gets an existing board!',
      operationId: 'getBoard',
      responses: {
        [STATUS_CODES.OK]: {
          description: 'The board',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Board' }
            }
          }
        },
        ...generateErrorResponses(boardNotFoundError(), invalidBoardError())
      }
    }
  },
  '/boards/:board_id/toggle_flag': {
    put: {
      tags: [Tags.BOARDS],
      description: 'Toggles a flag on a position',
      operationId: 'toggleFLag',
      parameters: getSwaggerParameters(toggleFlagSchema),
      responses: {
        [STATUS_CODES.OK]: {
          description: 'The updated board',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Board' }
            }
          }
        },
        ...generateErrorResponses(
          boardNotFoundError(),
          invalidBoardError(),
          positionHasHintError(),
          invalidPositionForBoard()
        )
      }
    }
  }
};
