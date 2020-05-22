export interface Hint {
  value: number;
}

export function isHint(hint: unknown): hint is Hint {
  const asHint = hint as Hint;
  let isIt = asHint && Boolean(Number.isInteger(asHint.value));
  isIt = isIt && Boolean(asHint.value >= 0);
  return isIt;
}
