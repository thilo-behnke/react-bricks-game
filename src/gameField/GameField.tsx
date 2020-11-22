import React, { Dispatch, useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import {
  GridCell,
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

  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);

  const getCell = (cellRow: number, cellCol: number) => {
    return grid.find(({ row, col }) => row === cellRow && col === cellCol);
  };

  // TODO: On hover: Detect adjacent and set state. Detection could be run in effect? Would that be more performant?

  return (
    <Grid {...props}>
      {zipRange(props.rows, props.cols).map(([row, col]) => {
        const cell = getCell(row, col);
        return (
          <GameFieldCell
            onMouseEnter={() => (cell ? setSelectedCell(cell) : null)}
            isSelected={selectedCell?.row === row && selectedCell?.col === col}
            key={`${row}/${col}`}
            color={cell?.color}
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
