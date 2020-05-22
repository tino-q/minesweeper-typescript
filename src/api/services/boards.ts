import { inspect } from 'util';

import { Board, buildBoard } from '~api/models/board';
import { Position } from '~api/models/position';
import logger from '~libs/logger';
import { CreateBoardParams, BoardPositionParams } from '~api/mappers/boards';
import repositories from '~api/repositories';
import { boardNotFoundError, positionHasHintError, invalidPositionForBoard } from '~api/errors';
import { serializePosition, SerializedPosition } from '~api/serializers/position';
import { Hint } from '~api/models/hint';

export const getBoardById = async (id: string): Promise<Board> => {
  logger.info(`Searching board by id: ${id}`);
  const board: Board | null = await repositories.boards.findBoardById(id);
  if (!board) {
    throw boardNotFoundError();
  }
  logger.info(`Found board ${inspect(board)}`);
  return board;
};

export const createBoard = async (params: CreateBoardParams): Promise<Board> => {
  logger.info(`Creating board ${inspect(params)}`);
  const boardDraft: Board = buildBoard(params.rows, params.columns);
  const board: Board = await repositories.boards.saveBoard(boardDraft);
  logger.info(`Created board ${inspect(board)}`);
  return board;
};

export const boardOver = async (board: Board, explosionPos: Position): Promise<Board> => {
  const updatedBoard: Board = await repositories.boards.saveBoard({
    ...board,
    explosionPos
  });
  logger.info(`Board over ${inspect(updatedBoard)}`);
  return updatedBoard;
};

const getNeighbours = (position: Position): Position[] => [
  { x: position.x - 1, y: position.y },
  { x: position.x + 1, y: position.y },
  { x: position.x, y: position.y - 1 },
  { x: position.x, y: position.y + 1 },
  { x: position.x - 1, y: position.y - 1 },
  { x: position.x + 1, y: position.y + 1 },
  { x: position.x + 1, y: position.y - 1 },
  { x: position.x - 1, y: position.y + 1 }
];

const getAmountMinesAround = (position: Position, board: Board): number =>
  getNeighbours(position).filter((p: Position) => board.mines[serializePosition(p)]).length;

const calculateNewHints = (board: Board, position: Position): Record<SerializedPosition, Hint> => {
  const queue: Position[] = [position];
  const newHints: Record<SerializedPosition, Hint> = {};
  while (queue.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentPosition = queue.shift()!;
    const pos = serializePosition(currentPosition);
    const amountMinesAround = getAmountMinesAround(currentPosition, board);
    newHints[pos] = { value: amountMinesAround };
    if (amountMinesAround === 0) {
      const toEnqueueNeighbours = getNeighbours(currentPosition).filter(
        (n: Position): boolean =>
          n.x >= 0 &&
          n.y >= 0 &&
          n.x < board.columns &&
          n.y < board.rows &&
          !board.hints[serializePosition(n)] &&
          !newHints[serializePosition(n)] &&
          !board.mines[serializePosition(n)] &&
          !queue.find((p: Position): boolean => p.x === n.x && p.y === n.y)
      );
      toEnqueueNeighbours.map((n: Position) => queue.push(n));
    }
  }
  return newHints;
};

const findAndValidateBoardPosition = async (params: BoardPositionParams): Promise<Board> => {
  const board: Board | null = await repositories.boards.findBoardById(params.boardId);
  if (!board || board.explosionPos) {
    throw boardNotFoundError();
  }
  if (params.position.x >= board.columns || params.position.y >= board.rows) {
    throw invalidPositionForBoard();
  }
  return board;
};

export const toggleFlag = async (params: BoardPositionParams): Promise<Board> => {
  logger.info(`Toggling flag ${inspect(params)}`);
  const board = await findAndValidateBoardPosition(params);
  const pos = serializePosition(params.position);
  if (board.hints[pos]) {
    throw positionHasHintError();
  }
  board.flags[pos] = board.flags[pos] ? undefined : true;
  const updatedBoard: Board = await repositories.boards.saveBoard(board);
  logger.info(`Flag toggled ${inspect(updatedBoard)}`);
  return updatedBoard;
};

export const revealPosition = async (params: BoardPositionParams): Promise<Board> => {
  logger.info(`Putting flag ${inspect(params)}`);
  const board: Board = await findAndValidateBoardPosition(params);
  const pos = serializePosition(params.position);
  if (board.mines[pos]) {
    return boardOver(board, params.position);
  }
  if (board.hints[pos]) {
    throw positionHasHintError();
  }
  board.hints = { ...board.hints, ...calculateNewHints(board, params.position) };
  const updatedBoard: Board = await repositories.boards.saveBoard(board);
  logger.info(`Flag put ${inspect(updatedBoard)}`);
  return updatedBoard;
};
