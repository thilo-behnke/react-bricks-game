import { GridCell, GridMapping } from "../mappingProvider/GridMappingProvider";
import { omit } from "./ObjectUtils";

export const getAdjacentWithSameColor = (
  start: GridCell,
  grid: GridMapping
): Array<GridCell> => {
  const startCell = grid.find(
    ({ row, col }) => row === start.row && col === start.col
  );
  if (!startCell) {
    return [];
  }

  let visited: { [row: number]: { [col: number]: true } } = {};
  const inner = (start: GridCell, grid: GridMapping): GridMapping => {
    const { row, col } = start;
    const left = { row, col: col - 1 },
      right = { row, col: col + 1 },
      up = { row: row - 1, col },
      down = { row: row + 1, col };
    const potentialAdjacent = [left, right, up, down]
      .filter(({ row, col }) => !visited[row]?.[col])
      .map(({ row, col }) =>
        grid.find(
          ({ row: cellRow, col: cellCol }) => row === cellRow && col === cellCol
        )
      )
      .filter(Boolean) as GridMapping;

    if (!visited[row]) {
      visited[row] = {};
    }
    visited[row][col] = true;

    const adjacentWithSameColor = potentialAdjacent.filter(
      ({ color }) => color === startCell.color
    );
    const adjacentResults = adjacentWithSameColor.reduce(
      (acc: GridMapping, cell) => [...acc, ...inner(cell, grid)],
      []
    );

    return [omit(start, "color"), ...adjacentResults];
  };
  return inner({ ...start, ...startCell }, grid);
};
