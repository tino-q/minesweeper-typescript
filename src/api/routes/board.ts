import { Router } from 'express';

import { validateSchema } from '../middlewares/schema';
import { getBoardSchema, createBoardSchema, toggleFlagSchema, revealPositionSchema } from '../schemas';

import { getBoard, createBoard, toggleFlag, revealPosition } from '~api/controllers/board';

const route = Router();

export function generateBoardRoutes(app: Router): void {
  app.use('/boards', route);
  route.post('/', [validateSchema(createBoardSchema)], createBoard);
  route.get('/:board_id', [validateSchema(getBoardSchema)], getBoard);
  route.put('/:board_id/toggle_flag', [validateSchema(toggleFlagSchema)], toggleFlag);
  route.put('/:board_id/reveal', [validateSchema(revealPositionSchema)], revealPosition);
}
