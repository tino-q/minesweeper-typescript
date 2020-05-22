import { Position } from '~api/models/position';
import { BOARD_MAX_ROWS, BOARD_MAX_COLUMNS } from '~constants';

export type SerializedPosition = string;

export function serializePosition(pos: Position): SerializedPosition {
  return `${pos.x}.${pos.y}`;
}

export function isSerializedPosition(pos: unknown): pos is SerializedPosition {
  const asPos = pos as SerializedPosition;
  const [x, y] = asPos.split('.').map(Number);
  let isIt = Boolean(asPos && Number.isInteger(x) && x >= 0 && x < BOARD_MAX_COLUMNS);
  isIt = isIt && Boolean(asPos && Number.isInteger(y) && y >= 0 && y < BOARD_MAX_ROWS);
  return isIt;
}
