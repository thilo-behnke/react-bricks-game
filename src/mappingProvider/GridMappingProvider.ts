import { Color, GridMapping } from "../model/GameFieldModel";
import { zipRange } from "../utils/ListUtils";
import React from "react";

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
        rand > 80
          ? Color.BLUE
          : rand > 30
          ? Color.YELLOW
          : rand > 20
          ? Color.GREEN
          : Color.ORANGE;
      return {
        id: index,
        row,
        col,
        color,
      };
    });
  }
}

export const GridMappingProviderContext = React.createContext(
  new StaticGridMappingProvider()
);
