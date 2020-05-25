import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~constants';

export const BOARD_NOT_FOUND = 'board_not_found';
export const boardNotFoundError = createError(BOARD_NOT_FOUND, STATUS_CODES.NOT_FOUND);

export const INVALID_BOARD = 'invalid_board';
export const invalidBoardError = createError(INVALID_BOARD, STATUS_CODES.SERVICE_UNAVAILABLE);

export const POSITION_HAS_HINT_ERROR = 'position_has_hint';
export const positionHasHintError = createError(POSITION_HAS_HINT_ERROR, STATUS_CODES.BAD_REQUEST);

export const INVALID_POSITION_FOR_BOARD = 'invalid_position_for_board';
export const invalidPositionForBoard = createError(INVALID_POSITION_FOR_BOARD, STATUS_CODES.BAD_REQUEST);

export const TAG_ALREADY_EXISTS_ERROR = 'tag_already_exists_error';
export const tagAlreadyExistsError = createError(TAG_ALREADY_EXISTS_ERROR, STATUS_CODES.BAD_REQUEST);