import { Request, Response, NextFunction } from 'express';

import { serializeBoard } from '~api/serializers/board';
import services from '~api/services';
import { Board } from '~api/models/board';
import { mapCreateBoardParams, mapBoardPositionParams } from '~api/mappers/boards';
import { STATUS_CODES } from '~constants';

export async function getBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const board: Board = await services.boards.getBoardById(req.params.board_id);
    return res.status(STATUS_CODES.OK).send(serializeBoard(board));
  } catch (err) {
    return next(err);
  }
}

export async function createBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const newBoard: Board = await services.boards.createBoard(mapCreateBoardParams(req));
    return res.status(STATUS_CODES.CREATED).send(serializeBoard(newBoard));
  } catch (err) {
    return next(err);
  }
}

export async function toggleFlag(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const board: Board = await services.boards.toggleFlag(mapBoardPositionParams(req));
    return res.status(STATUS_CODES.OK).send(serializeBoard(board));
  } catch (err) {
    return next(err);
  }
}

export async function revealPosition(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const board: Board = await services.boards.revealPosition(mapBoardPositionParams(req));
    return res.status(STATUS_CODES.OK).send(serializeBoard(board));
  } catch (err) {
    return next(err);
  }
}

export async function saveBoardByTag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    await services.boards.saveBoardBytag(req.params.board_id, req.params.board_tag);
    return res.status(STATUS_CODES.CREATED).end();
  } catch (err) {
    return next(err);
  }
}


export async function toggleQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const board: Board = await services.boards.toggleQuestionMark(mapBoardPositionParams(req));
    return res.status(STATUS_CODES.OK).send(serializeBoard(board));
  } catch (err) {
    return next(err);
  }
}


