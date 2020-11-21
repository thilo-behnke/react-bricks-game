import { range, zip, zipRange } from "./ListUtils";

describe("ListUtils", () => {
  describe("ListUtils.range", () => {
    it("should return empty list for n = 0", () => {
      const res = range(0);
      expect(res).toEqual([]);
    });
    it("should return empty list for n < 0", () => {
      const res = range(-1);
      expect(res).toEqual([]);
    });
    it("should return list with list.length = n and list[i] = i", () => {
      const res = range(10);
      expect(res).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("ListUtils.zip", () => {
    it("should return empty list for a = [] and b = []", () => {
      const res = zip([], []);
      expect(res).toEqual([]);
    });
    it("should return empty list when a is non-empty and b = []", () => {
      const res = zip([3, 5], []);
      expect(res).toEqual([]);
    });
    it("should return empty list when a = [] and b is non-empty", () => {
      const res = zip([], [4, 45]);
      expect(res).toEqual([]);
    });
    it("should return zipped list when a is non-empty and b is non-empty", () => {
      const res = zip([23, 55], [4, 45]);
      expect(res).toEqual([
        [23, 4],
        [23, 45],
        [55, 4],
        [55, 45],
      ]);
    });
  });

  describe("ListUtils.zipRange", () => {
    it("should return empty list for n = 0 and m = 0", () => {
      const res = zipRange(0, 0);
      expect(res).toEqual([]);
    });
    it("should return zipped range of n and m for n > 0 and m > 0", () => {
      const res = zipRange(4, 2);
      expect(res).toEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        [3, 0],
        [3, 1],
      ]);
    });
  });
});
