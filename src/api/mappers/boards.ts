import { Request } from 'express';

import { Position } from '~api/models/position';
import { 
  BOARD_DEFAULT_ROWS,
  BOARD_DEFAULT_COLUMNS,
  BOARD_MAX_ROWS,
  BOARD_MAX_COLUMNS,
  BOARD_DEFAULT_DIFFICULTY,
} from '~constants';

export interface CreateBoardParams {
  rows: number;
  columns: number;
  difficulty?: number;
}

export const mapCreateBoardParams = (req: Request): CreateBoardParams => {
  const rows = Number(req.body.rows);
  const columns = Number(req.body.columns);
  const difficulty = Number(req.body.difficulty);
  const isDifficultySafe = Number.isInteger(difficulty) && difficulty > 0 && difficulty <= 100;
  const isRowSafe = Number.isInteger(rows) && rows > 0 && rows <= BOARD_MAX_ROWS;
  const isColumnSafe = Number.isInteger(columns) && columns > 0 && columns <= BOARD_MAX_COLUMNS;
  const safeRows = isRowSafe ? rows : BOARD_DEFAULT_ROWS;
  const safeColumns = isColumnSafe ? columns : BOARD_DEFAULT_COLUMNS;
  const safeDifficulty = isDifficultySafe ? difficulty : BOARD_DEFAULT_DIFFICULTY; 
  return {
    rows: safeRows,
    columns: safeColumns,
    difficulty: safeDifficulty,
  };
};

export interface BoardPositionParams {
  position: Position;
  boardId: string;
}

export const mapBoardPositionParams = (req: Request): BoardPositionParams => ({
  position: { x: req.body.column, y: req.body.row },
  boardId: req.params.board_id
});
