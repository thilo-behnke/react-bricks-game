import { Color, GridCell, GridMapping } from "../model/GameFieldModel";
import { zipRange } from "../utils/ListUtils";
import React from "react";
import { getAdjacent } from "../utils/GameFieldUtils";

export interface GridMappingProvider {
  generateMapping: (rows: number, cols: number) => GridMapping;
}

export class StaticGridMappingProvider implements GridMappingProvider {
  generateMapping(rows: number, cols: number): GridMapping {
    return zipRange(rows, cols).map(([row, col], index: number) => {
      return {
        id: index,
        row,
        col,
        color: row % 4 === 0 ? Color.YELLOW : Color.BLUE,
      };
    });
  }
}

export class RandomGridMappingProvider implements GridMappingProvider {
  generateMapping(rows: number, cols: number): GridMapping {
    return zipRange(rows, cols).map(([row, col], index: number) => {
      const rand = Math.random() * 100;
      const color =
        rand > 80 ? Color.BLUE : rand > 30 ? Color.YELLOW : Color.GREEN;
      return {
        id: index,
        row,
        col,
        color,
      };
    });
  }
}

export class ClusteringRandomGridMappingProvider
  implements GridMappingProvider {
  generateMapping(rows: number, cols: number): GridMapping {
    return (
      zipRange(rows, cols)
        // Shuffle randomly.
        .sort(() => Math.sign(Math.random() - 0.5))
        // Get random color for cell - if an adjacent cell is already colored, prefer its color.
        .reduce((acc, [row, col], index: number) => {
          const adjacent = getAdjacent({ row, col });
          const adjacentCells = adjacent
            .map((adjacentCell) =>
              acc.find(
                ({ row: adjacentRow, col: adjacentCol }) =>
                  adjacentCell.row === adjacentRow &&
                  adjacentCell.col === adjacentCol
              )
            )
            .filter(Boolean) as GridMapping;
          if (adjacentCells.length) {
            const randomIndex = Math.ceil(
              Math.random() * (adjacentCells.length - 1)
            );
            const randomCell = adjacentCells[randomIndex];
            const rand = Math.random() * 100;
            if (rand > 50) {
              return [
                ...acc,
                {
                  id: index,
                  row,
                  col,
                  color: randomCell.color,
                },
              ];
            }
          }
          const rand = Math.random() * 100;
          const color =
            rand > 80 ? Color.BLUE : rand > 30 ? Color.YELLOW : Color.GREEN;
          return [
            ...acc,
            {
              id: index,
              row,
              col,
              color,
            },
          ] as GridMapping;
        }, [] as GridMapping)
        // Sort the rows and cols by row/col.
        .sort((cellA: GridCell, cellB: GridCell) => {
          if (cellA.row !== cellB.row) {
            return cellA.row - cellB.row;
          }
          return cellA.col - cellB.col;
        })
    );
  }
}

export const GridMappingProviderContext = React.createContext(
  new StaticGridMappingProvider()
);
