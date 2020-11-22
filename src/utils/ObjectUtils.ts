export const omit = <T, R>(obj: T, toRemove: string): R => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => key !== toRemove)
  ) as R;
};
