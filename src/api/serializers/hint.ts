import { Hint } from '~api/models/hint';

export type SerializedHint = number;

export function serializeHint(hint: Hint): SerializedHint {
  return hint.value;
}

export function isSerializedHint(hint: unknown): hint is SerializedHint {
  const asHint = hint as SerializedHint;
  let isIt = Boolean(asHint && Number.isInteger(asHint));
  isIt = isIt && Boolean(Number(asHint) >= 0);
  return isIt;
}
