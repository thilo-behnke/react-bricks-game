import { groupBy } from "./ListUtils";
import { GridCell, GridMapping } from "../model/GameFieldModel";

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

    return [start, ...adjacentResults];
  };
  return inner({ ...start, ...startCell }, grid);
};

export const repositionGrid = (grid: GridMapping): [GridMapping, boolean] => {
  let wasUpdated = false;
  const groupedByCol = groupBy(grid, "col");
  const newGrid = groupedByCol
    .map(({ items: cells }) => {
      return cells.map((cell: GridCell, index: number) => {
        const isCellPositionedCorrectly = cell.row === index;
        if (!isCellPositionedCorrectly) {
          wasUpdated = true;
          return { ...cell, row: index };
        }
        return cell;
      });
    })
    .reduce((acc: GridMapping, colGroup) => {
      // TODO: Improve - this rearranges the grid, no longer by row, but by col!
      return [...acc, ...Object.values(colGroup)];
    }, []);
  return [newGrid, wasUpdated];
};

export const areCellsEqual = (cellA: GridCell, cellB: GridCell) => {
  return cellA.row === cellB.row && cellA.col === cellB.col;
};
