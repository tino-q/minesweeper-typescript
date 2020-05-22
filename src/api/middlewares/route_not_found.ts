import { Request, Response, NextFunction } from 'express';

import { notFoundError } from '~api/errors';
import logger from '~libs/logger';

export function routeNotFound(req: Request, res: Response, next: NextFunction): Response | void {
  logger.error(`Invalid request on ${req.path}`);
  return next(notFoundError());
}
