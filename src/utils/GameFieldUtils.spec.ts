import { getAdjacentWithSameColor } from "./GameFieldUtils";
import { Color } from "../model/GameFieldModel";

describe("GameFieldUtils", () => {
  describe("GameFieldUtils.getAdjacentWithSameColor", () => {
    it("should return an empty list if the start cell cannot be found.", () => {
      // given
      const start = { row: 11, col: 5 };
      const grid = {};
      // when
      const res = getAdjacentWithSameColor(start, grid);
      expect(res).toEqual([]);
    });
    it("should return just the given start cell if it is the only element in the grid", () => {
      // given
      const start = { row: 11, col: 5 };
      const grid = { 11: { 5: {} } };
      // when
      const res = getAdjacentWithSameColor(start, grid);
      expect(res).toEqual([start]);
    });
    it("should find adjacent node with same color", () => {
      // given
      const start = { row: 11, col: 5 };
      const grid = {
        11: { 5: { color: Color.BLUE }, 6: { color: Color.BLUE } },
      };
      // when
      const res = getAdjacentWithSameColor(start, grid);
      const expected = [start, { row: 11, col: 6 }];
      expect(res).toEqual(expected);
    });
  });
});
