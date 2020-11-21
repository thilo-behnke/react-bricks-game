import { GridMapping } from "../mappingProvider/GridMappingProvider";
import { Color, GridCoordinates } from "../model/GameFieldModel";
import { omit } from "./ObjectUtils";

export const getAdjacentWithSameColor = (
  start: GridCoordinates,
  grid: GridMapping
): Array<GridCoordinates> => {
  const startCell = grid[start.row]?.[start.col];
  if (!startCell) {
    return [];
  }

  let visited: { [row: number]: { [col: number]: true } } = {};
  const inner = (
    start: { row: number; col: number; color?: Color },
    grid: GridMapping
  ): Array<{ row: number; col: number }> => {
    const { row, col } = start;
    const left = { row, col: col - 1 },
      right = { row, col: col + 1 },
      up = { row: row - 1, col },
      down = { row: row + 1, col };
    const potentialAdjacent = [left, right, up, down]
      .filter(({ row, col }) => !visited[row]?.[col])
      .map(({ row, col }) =>
        grid[row]?.[col]
          ? {
              row,
              col,
              ...grid[row][col],
            }
          : null
      )
      .filter(Boolean) as Array<{ row: number; col: number; color?: Color }>;

    if (!visited[row]) {
      visited[row] = {};
    }
    visited[row][col] = true;

    const adjacentWithSameColor = potentialAdjacent.filter(
      ({ color }) => color === startCell.color
    );
    const adjacentResults = adjacentWithSameColor.reduce(
      (acc: Array<{ row: number; col: number; color?: Color }>, cell) => [
        ...acc,
        ...inner(cell, grid),
      ],
      []
    );

    return [omit(start, "color"), ...adjacentResults];
  };
  return inner({ ...start, ...startCell }, grid);
};
