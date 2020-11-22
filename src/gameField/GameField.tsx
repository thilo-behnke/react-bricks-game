import React, { Dispatch, useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import { Color } from "../model/GameFieldModel";
import {
  GridMapping,
  GridMappingAction,
  GridMappingProviderContext,
} from "../mappingProvider/GridMappingProvider";

export type GameFieldProps = {
  rows: number;
  cols: number;
};

const Grid = styled.div`
  justify-self: center;
  display: grid;
  grid-template-rows: repeat(${(props: GameFieldProps) => props.rows}, 2em);
  grid-template-columns: repeat(${(props: GameFieldProps) => props.cols}, 2em);
`;

export const GameField = (props: GameFieldProps) => {
  const gridMappingProvider = useContext(GridMappingProviderContext);
  const [grid, dispatch]: [
    GridMapping,
    Dispatch<GridMappingAction>
  ] = useReducer((state: GridMapping, action: GridMappingAction) => {
    switch (action.type) {
      case "update_cell_color":
        const {
          payload: { row, col, color },
        } = action;
        if (action.payload.color === null) {
          if (!state[row]?.[col]) {
            return state;
          }
          const { color: _, ...stateWithoutColor } = state[row][col];
          return {
            ...state,
            [row]: { ...state[row], [col]: stateWithoutColor },
          };
        }
        return {
          ...state,
          [row]: {
            ...state[row],
            [col]: { ...state[row][col], color: color as Color },
          },
        };
      default:
        return state;
    }
  }, gridMappingProvider.generateMapping(props.rows, props.cols));

  // TODO: On hover: Detect adjacent and set state. Detection could be run in effect? Would that be more performant?

  return (
    <Grid {...props}>
      {zipRange(props.rows, props.cols).map(([row, col]) => {
        return (
          <GameFieldCell
            key={`${row}/${col}`}
            color={grid[row]?.[col]?.color}
            onClick={() =>
              dispatch({
                type: "update_cell_color",
                payload: { row, col, color: null },
              })
            }
          />
        );
      })}
    </Grid>
  );
};
