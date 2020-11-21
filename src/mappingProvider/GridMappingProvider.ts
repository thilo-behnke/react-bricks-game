import { Color } from "../model/GameFieldModel";
import { zipRange } from "../utils/ListUtils";
import React, { ReducerAction } from "react";

export interface GridMappingProvider {
  generateMapping: (rows: number, cols: number) => GridMapping;
}

export type GridMapping = {
  [row: number]: { [col: number]: { color?: Color } };
};

export type GridMappingAction = {
  type: "update_cell_color";
  payload: { row: number; col: number; color: Color | null };
};

export class StaticGridMappingProvider implements GridMappingProvider {
  generateMapping(rows: number, cols: number): GridMapping {
    return zipRange(rows, cols)
      .map(([row, col]) => {
        return { row, col, color: row % 4 === 0 ? Color.YELLOW : Color.BLUE };
      })
      .reduce((acc, { row, col, color }) => {
        if (!acc[row]) {
          acc[row] = {};
        }
        return {
          ...acc,
          [row]: {
            ...(acc[row] || {}),
            [col]: { ...(acc[row][col] || {}), color },
          },
        };
      }, {} as GridMapping);
  }
}

export const GridMappingProviderContext = React.createContext(
  new StaticGridMappingProvider()
);
