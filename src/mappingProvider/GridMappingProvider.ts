import { Color } from "../model/GameFieldModel";
import { zipRange } from "../utils/ListUtils";
import React, { ReducerAction } from "react";

export interface GridMappingProvider {
  generateMapping: (rows: number, cols: number) => GridMapping;
}

export type GridCell = {
  row: number;
  col: number;
  color: Color;
};

export type GridMapping = Array<GridCell>;

export type GridMappingAction = {
  type: "remove_cell";
  payload: { row: number; col: number };
};

export class StaticGridMappingProvider implements GridMappingProvider {
  generateMapping(rows: number, cols: number): GridMapping {
    return zipRange(rows, cols).map(([row, col]) => {
      return { row, col, color: row % 4 === 0 ? Color.YELLOW : Color.BLUE };
    });
  }
}

export const GridMappingProviderContext = React.createContext(
  new StaticGridMappingProvider()
);
