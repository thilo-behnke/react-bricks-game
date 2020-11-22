import React, { Dispatch, useContext, useReducer } from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import {
  GridMapping,
  GridMappingAction,
  GridMappingProviderContext,
} from "../mappingProvider/GridMappingProvider";
import { GridMappingReducer } from "./reducer/GridMappingReducer";

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
  ] = useReducer(
    GridMappingReducer,
    gridMappingProvider.generateMapping(props.rows, props.cols)
  );

  const getColor = (cellRow: number, cellCol: number) => {
    const cell = grid.find(
      ({ row, col }) => row === cellRow && col === cellCol
    );
    return cell?.color;
  };

  // TODO: On hover: Detect adjacent and set state. Detection could be run in effect? Would that be more performant?

  return (
    <Grid {...props}>
      {zipRange(props.rows, props.cols).map(([row, col]) => {
        return (
          <GameFieldCell
            onMouseEnter={console.log}
            key={`${row}/${col}`}
            color={getColor(row, col)}
            onClick={() =>
              dispatch({
                type: "remove_cell",
                payload: { row, col },
              })
            }
          />
        );
      })}
    </Grid>
  );
};
