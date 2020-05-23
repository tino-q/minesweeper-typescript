import { Board, isBoard } from '~api/models/board';
import services from '~api/services';
import logger from '~libs/logger';
import { serviceUnavailableError, invalidBoardError } from '~api/errors';

export const findBoardById = async (id: string): Promise<Board | null | never> => {
  let board;
  try {
    board = await services.dynamodb.getValue(id);
  } catch (err) {
    logger.error(`Fail dynamodb getValue id: ${id}`);
    throw serviceUnavailableError({ error: err });
  }
  if (!board) {
    return null;
  }
  if (isBoard(board)) {
    return board;
  }
  throw invalidBoardError();
};

export const saveBoard = async (board: Board): Promise<Board> => {
  let savedBoard: Board | null;
  try {
    savedBoard = await services.dynamodb.putGetValue(board.id, board);
  } catch (err) {
    logger.error(`Fail dynamodb putGetValue: ${board.id}`);
    throw serviceUnavailableError({ error: err });
  }
  if (isBoard(savedBoard)) {
    return savedBoard;
  }
  throw invalidBoardError();
};
