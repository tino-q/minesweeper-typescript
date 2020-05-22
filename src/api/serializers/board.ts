import { mapValues } from 'lodash';

import { SerializedPosition, serializePosition } from './position';
import { SerializedHint, serializeHint } from './hint';

import { Board } from '~api/models/board';

export interface SerializedBoard {
  id: string;
  rows: number;
  columns: number;
  flags: Record<SerializedPosition, true | undefined>;
  mines?: Record<SerializedPosition, true | undefined>;
  hints: Record<SerializedPosition, SerializedHint>;
  begin_epoch_ms: number;
  explosion_position?: SerializedPosition;
}

export function serializeBoard(board: Board): SerializedBoard {
  return {
    id: board.id,
    rows: board.rows,
    columns: board.columns,
    flags: board.flags,
    hints: mapValues(board.hints, serializeHint),
    mines: board.explosionPos && board.mines,
    explosion_position: board.explosionPos && serializePosition(board.explosionPos),
    begin_epoch_ms: board.begin_epoch_ms
  };
}
