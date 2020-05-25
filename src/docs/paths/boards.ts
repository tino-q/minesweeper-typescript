import { generateErrorResponses, getSwaggerParameters } from '../utils';
import * as Tags from '../tags';

import {
  boardNotFoundError,
  positionHasHintError,
  invalidPositionForBoard,
  invalidBoardError,
  tagAlreadyExistsError
} from '~api/errors';
import { STATUS_CODES } from '~constants';
import { createBoardSchema, boardPositionSchema, getBoardSchema, saveBoardByTagSchema } from '~api/schemas';

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
  '/boards/:board_tag': {
    get: {
      tags: [Tags.BOARDS],
      description: 'Gets a saved board!',
      operationId: 'getSavedBoard',
      parameters: getSwaggerParameters(getBoardSchema),
      responses: {
        [STATUS_CODES.OK]: {
          description: 'The saved board',
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
  '/boards/:board_id/save/:board_tag': {
    put: {
      tags: [Tags.BOARDS],
      description: 'Saves a board by a tag!',
      operationId: 'saveBoardByTag',
      parameters: getSwaggerParameters(saveBoardByTagSchema),
      responses: {
        [STATUS_CODES.CREATED]: { description: "Board saved ok" },
        ...generateErrorResponses(tagAlreadyExistsError(), boardNotFoundError(), invalidBoardError())
      }
    }
  },
  '/boards/:board_id/toggle_flag': {
    put: {
      tags: [Tags.BOARDS],
      description: 'Toggles a flag on a position',
      operationId: 'toggleFLag',
      parameters: getSwaggerParameters(boardPositionSchema),
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
  },
  '/boards/:board_id/reveal': {
    put: {
      tags: [Tags.BOARDS],
      description: 'Reveals a position',
      operationId: 'revealPosition',
      parameters: getSwaggerParameters(boardPositionSchema),
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
  },
  '/boards/:board_id/toggle_question': {
    put: {
      tags: [Tags.BOARDS],
      description: 'Toggles a question mark on a position',
      operationId: 'toggleQuestion',
      parameters: getSwaggerParameters(boardPositionSchema),
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
