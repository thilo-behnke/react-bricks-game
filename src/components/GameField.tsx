import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import { InteractionMode } from "../reducer/GameStateReducer";
import { GridCell } from "../model/GameFieldModel";
import {
  GameDefContext,
  GameStateContext,
  GameStateDispatcherContext,
} from "../reducer/GameStateContext";

type GridProps = {
  rows: number;
  cols: number;
};

const StyledGameField = styled.div`
  grid-area: game;

  justify-self: center;
  display: grid;
  grid-template-rows: repeat(${(props: GridProps) => props.rows}, 2em);
  grid-template-columns: repeat(${(props: GridProps) => props.cols}, 2em);
`;

export const GameField = () => {
  const { grid, selectedCells, interactionMode } = useContext(GameStateContext);
  const { rows, cols } = useContext(GameDefContext);
  const dispatch = useContext(GameStateDispatcherContext);

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

  const dispatchSelectCells = (
    cellPosition: GridCell,
    expandToAdjacent = true
  ) => {
    dispatch({
      type: "select_cells",
      payload: { cellPosition, expandToAdjacent },
    });
  };

  const dispatchUnselectCells = () => {
    dispatch({
      type: "unselect_cells",
    });
  };

  const dispatchRemoveCells = () => {
    dispatch({
      type: "mark_cells_for_destruction",
      payload: selectedCells,
    });
  };

  const dispatchSetWildcard = (cell: GridCell) => {
    dispatch({
      type: "set_wildcard",
      payload: cell,
    });
  };

  const handleCellMouseEnter = (cell?: GridCell) => {
    return () => {
      if (!cell) {
        dispatchUnselectCells();
        return;
      }

      if (interactionMode === InteractionMode.DEFAULT) {
        dispatchSelectCells(cell);
        return;
      } else if (
        interactionMode === InteractionMode.WILDCARD &&
        !cell.isWildcard
      ) {
        dispatchSelectCells(cell, false);
        return;
      }
    };
  };

  const handleCellClick = (cell?: GridCell) => {
    return () => {
      if (!cell) {
        return;
      }

      if (interactionMode === InteractionMode.DEFAULT) {
        dispatchRemoveCells();
        return;
      } else if (
        interactionMode === InteractionMode.WILDCARD &&
        !cell.isWildcard
      ) {
        dispatchSetWildcard(cell);
        return;
      }
    };
  };

  useEffect(() => {
    const markedForDestruction = grid.filter(
      (cell) => cell.isMarkedForDestruction
    );
    // TODO: Reset timer!
    if (markedForDestruction.length) {
      setTimeout(() => dispatch({ type: "destroy_marked_cells" }), 200);
    }
  }, [grid, dispatch]);

  return (
    <StyledGameField
      rows={rows}
      cols={cols}
      onMouseLeave={() => dispatchUnselectCells()}
    >
      {zipRange(rows, cols)
        .reverse()
        .map(([row, col]) => {
          const cell = getCell(row, col);
          return (
            <GameFieldCell
              onMouseEnter={handleCellMouseEnter(cell)}
              isSelected={isSelected(cell)}
              key={`${row}/${col}`}
              color={cell?.color}
              onClick={handleCellClick(cell)}
              shouldDestroy={cell?.isMarkedForDestruction}
            />
          );
        })}
    </StyledGameField>
  );
};
