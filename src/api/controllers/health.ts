import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json');

export function healthCheck(req: Request, res: Response): Response {
  return res.send({ uptime: process.uptime(), version });
}
