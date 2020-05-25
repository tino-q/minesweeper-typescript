import { isObject, every } from 'lodash';
import { v4 } from 'uuid';

import { getRandomPosition } from './position';

import { BOARD_MAX_ROWS, BOARD_MAX_COLUMNS } from '~constants/boards';
import { isSerializedPosition, serializePosition, SerializedPosition } from '~api/serializers/position';
import { Hint, isHint } from '~api/models/hint';
import { Position } from '~api/models/position';
import { CreateBoardParams } from 'src/api/mappers/boards';

export interface Board {
  id: string;
  rows: number;
  columns: number;
  difficulty: number;
  begin_epoch_ms: number;
  flags: Record<SerializedPosition, true | undefined>;
  questionMarks: Record<SerializedPosition, true | undefined>;
  mines: Record<SerializedPosition, true | undefined>;
  hints: Record<SerializedPosition, Hint>;
  explosionPos?: Position;
}

export function isBoard(board: unknown): board is Board {
  const asBoard = board as Board;
  let isIt = Boolean(asBoard && asBoard.id);
  isIt = isIt && Boolean(Number.isInteger(asBoard.rows));
  isIt = isIt && Boolean(asBoard.rows > 0 && asBoard.rows <= BOARD_MAX_ROWS);
  isIt = isIt && Boolean(Number.isInteger(asBoard.difficulty));
  isIt = isIt && Boolean(asBoard.difficulty > 0 && asBoard.difficulty <= 100);
  isIt = isIt && Boolean(Number.isInteger(asBoard.columns));
  isIt = isIt && Boolean(asBoard.columns > 0 && asBoard.columns <= BOARD_MAX_COLUMNS);
  isIt = isIt && Boolean(Number.isInteger(asBoard.begin_epoch_ms) && asBoard.begin_epoch_ms > 0);
  isIt = isIt && isObject(asBoard.flags) && every(Object.keys(asBoard.flags), isSerializedPosition);
  isIt = isIt && isObject(asBoard.mines) && every(Object.keys(asBoard.mines), isSerializedPosition);
  isIt = isIt && isObject(asBoard.questionMarks) && every(Object.keys(asBoard.questionMarks), isSerializedPosition);
  isIt =
    isIt &&
    isObject(asBoard.hints) &&
    every(
      Object.entries(asBoard.hints),
      ([pos, hint]: [SerializedPosition, Hint]) => isSerializedPosition(pos) && isHint(hint)
    );
  return isIt;
}

const range = (i: number): number[] => [...Array(i).keys()];

const buildMines = (params: CreateBoardParams): Record<SerializedPosition, true | undefined> =>
  range(Math.floor(params.difficulty / 100 * params.rows * params.columns)).reduce(
    (acum: Record<SerializedPosition, true | undefined>) => {
      let inserted = false;
      while (!inserted) {
        const randomPosition: Position = getRandomPosition(params.rows, params.columns);
        const serializedPos = serializePosition(randomPosition);
        if (!acum[serializedPos]) {
          acum[serializedPos] = true;
          inserted = true;
        }
      }
      return acum;
    },
    {}
  );

export const buildBoard = (
  params: CreateBoardParams,
  mines: Record<SerializedPosition, true | undefined> = buildMines(params)
): Board => ({
  id: v4(),
  rows: params.rows,
  columns: params.columns,
  difficulty: params.difficulty,
  flags: {},
  mines,
  hints: {},
  questionMarks: {},
  begin_epoch_ms: Date.now()
});
