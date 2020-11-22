import { getAdjacentWithSameColor } from "./GameFieldUtils";
import { Color } from "../model/GameFieldModel";
import { GridMapping } from "../mappingProvider/GridMappingProvider";

describe("GameFieldUtils", () => {
  describe("GameFieldUtils.getAdjacentWithSameColor", () => {
    it("should return an empty list if the start cell cannot be found.", () => {
      // given
      const start = { row: 11, col: 5, color: Color.BLUE };
      const grid: GridMapping = [];
      // when
      const res = getAdjacentWithSameColor(start, grid);
      expect(res).toEqual([]);
    });
    it("should return just the given start cell if it is the only element in the grid", () => {
      // given
      const start = { row: 11, col: 5, color: Color.BLUE };
      const grid: GridMapping = [start];
      // when
      const res = getAdjacentWithSameColor(start, grid);
      expect(res).toEqual([start]);
    });
    it("should find adjacent node with same color", () => {
      // given
      const start = { row: 11, col: 5, color: Color.BLUE };
      const adjacent = { row: 11, col: 6, color: Color.BLUE };
      const grid: GridMapping = [start, adjacent];
      // when
      const res = getAdjacentWithSameColor(start, grid);
      expect(res).toEqual(grid);
    });
  });
});
