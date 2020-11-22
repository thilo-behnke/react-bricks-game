export const range = (n: number) => {
  const inner = (i: number, acc: number[] = []): number[] => {
    if (i <= 0) {
      return acc;
    }
    const newAcc = [...acc, n - i];
    return inner(i - 1, newAcc);
  };
  return inner(n);
};

export const zip = <AT, BT>(listA: AT[], listB: BT[]): Array<[AT, BT]> => {
  return listA.reduce((acc: Array<[AT, BT]>, valA: AT): Array<[AT, BT]> => {
    const tuples = listB.map((valB) => [valA, valB] as [AT, BT]);
    return [...acc, ...tuples];
  }, []);
};

export const zipRange = (n: number, m: number): Array<[number, number]> => {
  return zip(range(n), range(m));
};

export const difference = <T>(
  listA: T[],
  listB: T[],
  equals: (elemA: T, elemB: T) => boolean
): Array<T> => {
  return listA.filter(
    (elemA: T) => !listB.some((elemB: T) => equals(elemA, elemB))
  );
};
