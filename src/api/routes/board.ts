import { Router } from 'express';

import { validateSchema } from '../middlewares/schema';
import { getBoardSchema, createBoardSchema, boardPositionSchema, saveBoardByTagSchema } from '../schemas';

import { getBoard, createBoard, toggleFlag, revealPosition, saveBoardByTag, toggleQuestion } from '~api/controllers/board';

const route = Router();

export function generateBoardRoutes(app: Router): void {
  app.use('/boards', route);
  route.post('/', [validateSchema(createBoardSchema)], createBoard);
  route.get('/:board_id', [validateSchema(getBoardSchema)], getBoard);
  route.put('/:board_id/toggle_flag', [validateSchema(boardPositionSchema)], toggleFlag);
  route.put('/:board_id/reveal', [validateSchema(boardPositionSchema)], revealPosition);
  route.put('/:board_id/toggle_question', [validateSchema(boardPositionSchema)], toggleQuestion);
  route.put('/:board_id/save/:board_tag', [validateSchema(saveBoardByTagSchema)], saveBoardByTag);
}
