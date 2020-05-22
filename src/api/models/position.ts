import { randInt } from '~libs/rand';

export interface Position {
  x: number;
  y: number;
}

export function isPosition(pos: unknown): pos is Position {
  const asPos = pos as Position;
  let isIt = asPos && Boolean(Number.isInteger(asPos.x));
  isIt = isIt && Boolean(asPos.x >= 0);
  isIt = isIt && Boolean(Number.isInteger(asPos.y));
  isIt = isIt && Boolean(asPos.y >= 0);
  return isIt;
}

export function getRandomPosition(rows: number, columns: number): Position {
  return {
    x: randInt(columns),
    y: randInt(rows)
  };
}
