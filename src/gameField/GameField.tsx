import React, {
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import { GridMappingProviderContext } from "../mappingProvider/GridMappingProvider";
import {
  GridMappingAction,
  GridMappingReducer,
  GridMappingState,
  InteractionMode,
} from "./reducer/GridMappingReducer";
import { GameState, GridCell } from "../model/GameFieldModel";

export type GameFieldProps = {
  rows: number;
  cols: number;
  wildCards: number;
  turns: number;
};

const Grid = styled.div`
  justify-self: center;
  display: grid;
  grid-template-rows: repeat(${(props: GameFieldProps) => props.rows}, 2em);
  grid-template-columns: repeat(${(props: GameFieldProps) => props.cols}, 2em);
`;

const Controls = styled.div`
  padding-top: 1em;
  grid-area: header;
  justify-self: center;
  display: flex;
  flex-flow: row wrap;

  * + * {
    margin-left: 1em;
  }
`;

export const GameField = (props: GameFieldProps) => {
  const gridMappingProvider = useContext(GridMappingProviderContext);
  const [
    {
      grid,
      selectedCells,
      interactionMode,
      availableWildcards,
      turns,
      gameState,
      points,
    },
    dispatch,
  ]: [GridMappingState, Dispatch<GridMappingAction>] = useReducer(
    GridMappingReducer,
    {
      grid: gridMappingProvider.generateMapping(props.rows, props.cols),
      selectedCells: [],
      selectedCellPosition: null,
      availableWildcards: props.wildCards,
      interactionMode: InteractionMode.DEFAULT,
      turns: props.turns,
      gameState: GameState.RUNNING,
      points: 0,
    }
  );

  const [basePoints, setBasePoints] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);

  useEffect(() => {
    setBasePoints(selectedCells.length * 10);
  }, [selectedCells]);

  useEffect(() => {
    if (!selectedCells.length) {
      setMultiplier(null);
    }
    setMultiplier(Math.max(Math.floor(selectedCells.length / 10), 1));
  }, [selectedCells, basePoints]);

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
      type: "remove_cells",
      payload: selectedCells,
    });
    dispatch({
      type: "decrement_turns",
    });
    dispatch({
      type: "add_points",
      payload: basePoints! * multiplier!,
    });
  };

  const toggleWildcardMode = () => {
    dispatch({
      type: "switch_interaction_mode",
      payload:
        interactionMode === InteractionMode.WILDCARD
          ? InteractionMode.DEFAULT
          : InteractionMode.WILDCARD,
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

  return (
    <React.Fragment>
      <Grid {...props} onMouseLeave={() => dispatchUnselectCells()}>
        {zipRange(props.rows, props.cols)
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
              />
            );
          })}
      </Grid>
      <Controls>
        <button disabled={availableWildcards <= 0} onClick={toggleWildcardMode}>
          {interactionMode === InteractionMode.DEFAULT
            ? "Set Wildcard (" + availableWildcards + " left)"
            : "Cancel"}
        </button>
        <div>Turns left: {turns}</div>
        <div>Game State: {gameState}</div>
        <div>
          Points: {points}{" "}
          {basePoints ? (
            <span>
              {" "}
              + {basePoints}{" "}
              {multiplier && multiplier > 1 ? " x " + multiplier : ""} (cells:{" "}
              {selectedCells.length})
            </span>
          ) : null}
        </div>
      </Controls>
    </React.Fragment>
  );
};
