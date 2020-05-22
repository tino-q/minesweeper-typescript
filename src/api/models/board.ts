import { isObject, every } from 'lodash';
import { v4 } from 'uuid';

import { getRandomPosition } from './position';

import { uuidv4regExp } from '~constants/regex';
import { BOARD_MAX_ROWS, BOARD_MAX_COLUMNS, MINES_TO_AREA_RATIO } from '~constants/boards';
import { isSerializedPosition, serializePosition, SerializedPosition } from '~api/serializers/position';
import { Hint, isHint } from '~api/models/hint';
import { Position } from '~api/models/position';

export interface Board {
  id: string;
  rows: number;
  columns: number;
  begin_epoch_ms: number;
  flags: Record<SerializedPosition, true | undefined>;
  mines: Record<SerializedPosition, true | undefined>;
  hints: Record<SerializedPosition, Hint>;
  explosionPos?: Position;
}

export function isBoard(board: unknown): board is Board {
  const asBoard = board as Board;
  let isIt = Boolean(asBoard && asBoard.id && asBoard.id.match(uuidv4regExp));
  isIt = isIt && Boolean(Number.isInteger(asBoard.rows));
  isIt = isIt && Boolean(asBoard.rows > 0 && asBoard.rows <= BOARD_MAX_ROWS);
  isIt = isIt && Boolean(Number.isInteger(asBoard.columns));
  isIt = isIt && Boolean(asBoard.columns > 0 && asBoard.columns <= BOARD_MAX_COLUMNS);
  isIt = isIt && Boolean(Number.isInteger(asBoard.begin_epoch_ms) && asBoard.begin_epoch_ms > 0);
  isIt = isIt && isObject(asBoard.flags) && every(Object.keys(asBoard.flags), isSerializedPosition);
  isIt = isIt && isObject(asBoard.mines) && every(Object.keys(asBoard.mines), isSerializedPosition);
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

const buildMines = (rows: number, columns: number): Record<SerializedPosition, true | undefined> =>
  range(Math.floor(MINES_TO_AREA_RATIO * rows * columns)).reduce(
    (acum: Record<SerializedPosition, true | undefined>) => {
      let inserted = false;
      while (!inserted) {
        const randomPosition: Position = getRandomPosition(rows, columns);
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
  rows: number,
  columns: number,
  mines: Record<SerializedPosition, true | undefined> = buildMines(rows, columns)
): Board => ({
  id: v4(),
  rows,
  columns,
  flags: {},
  mines,
  hints: {},
  begin_epoch_ms: Date.now()
});
