import React, { Dispatch, useContext, useReducer } from "react";
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
import { getAdjacentWithSameColor } from "../utils/GameFieldUtils";

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
  const [{ grid, selectedCells }, dispatch]: [
    { grid: GridMapping; selectedCells: GridMapping },
    Dispatch<GridMappingAction>
  ] = useReducer(GridMappingReducer, {
    grid: gridMappingProvider.generateMapping(props.rows, props.cols),
    selectedCells: [],
    selectedCellPosition: null,
  });

  const getCell = (cellRow: number, cellCol: number) => {
    return grid.find(({ row, col }) => row === cellRow && col === cellCol);
  };

  const isSelected = (cell?: GridCell) => {
    if (!cell) {
      return false;
    }
    return selectedCells.some(
      ({ row, col }) => row === cell.row && col === cell.col
    );
  };

  const dispatchSelectCells = (cellPosition: GridCell, cells: GridMapping) => {
    dispatch({
      type: "select_cells",
      payload: { cells, cellPosition },
    });
  };

  const dispatchUnselectCells = () => {
    dispatch({
      type: "unselect_cells",
    });
  };

  const dispatchRemoveCells = () => {
    dispatch({
      type: "remove_cells",
      payload: selectedCells,
    });
  };

  return (
    <Grid {...props} onMouseLeave={() => dispatchUnselectCells()}>
      {zipRange(props.rows, props.cols)
        .reverse()
        .map(([row, col]) => {
          const cell = getCell(row, col);
          return (
            <GameFieldCell
              onMouseEnter={() =>
                cell
                  ? dispatchSelectCells(
                      cell,
                      getAdjacentWithSameColor(cell, grid)
                    )
                  : null
              }
              isSelected={isSelected(cell)}
              key={`${row}/${col}`}
              color={cell?.color}
              onClick={dispatchRemoveCells}
            />
          );
        })}
    </Grid>
  );
};
