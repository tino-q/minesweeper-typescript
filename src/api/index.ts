import { Router } from 'express';

import { generateHealthRoutes } from './routes/health';
import { generateBoardRoutes } from './routes/board';

export default function generateAppRoutes(): Router {
  const app = Router();

  generateHealthRoutes(app);
  generateBoardRoutes(app);

  return app;
}
