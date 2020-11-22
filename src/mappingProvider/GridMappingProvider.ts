import { Color } from "../model/GameFieldModel";
import { zipRange } from "../utils/ListUtils";
import React from "react";

export interface GridMappingProvider {
  generateMapping: (rows: number, cols: number) => GridMapping;
}

export type GridCell = {
  id: number;
  row: number;
  col: number;
  color: Color;
};

export type GridMapping = Array<GridCell>;

export type GridMappingAction =
  | {
      type: "remove_cells";
      payload: GridMapping;
    }
  | {
      type: "select_cells";
      payload: GridCell;
    }
  | { type: "unselect_cells" };

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

export const GridMappingProviderContext = React.createContext(
  new StaticGridMappingProvider()
);
