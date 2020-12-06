import {
  areCellsEqual,
  getAdjacentWithSameColor,
  repositionGrid,
} from "../utils/GameFieldUtils";
import {
  Color,
  GameState,
  GridCell,
  GridMapping,
} from "../model/GameFieldModel";

export type BricksGameDef = {
  rows: number;
  cols: number;
  wildcards: number;
  turns: number;
};

export type BricksGameState = {
  grid: GridMapping;
  selectedCells: GridMapping;
  selectedCellPosition: GridCell | null;

  gameState: GameState;
  availableWildcards: number;
  turns: number;
  interactionMode: InteractionMode;
  points: number;

  basePoints: number | null;
  multiplier: number | null;
};

export enum InteractionMode {
  DEFAULT = "DEFAULT",
  WILDCARD = "WILDCARD",
}

export type GridMappingAction =
  | {
      type: "mark_cells_for_destruction";
      payload: GridMapping;
    }
  | {
      type: "destroy_marked_cells";
    }
  | {
      type: "select_cells";
      payload: { cellPosition: GridCell; expandToAdjacent: boolean };
    }
  | { type: "unselect_cells" }
  | { type: "set_wildcard"; payload: GridCell }
  | { type: "switch_interaction_mode"; payload: InteractionMode }
  | { type: "decrement_turns" }
  | {
      type: "reset";
      payload: { grid: GridMapping; wildcards: number; turns: number };
    };
export const GameStateReducer = (
  state: BricksGameState,
  action: GridMappingAction
): BricksGameState => {
  switch (action.type) {
    case "switch_interaction_mode":
      return { ...state, interactionMode: action.payload };
    case "mark_cells_for_destruction":
      const { payload: cellsToMark } = action;
      return {
        ...state,
        grid: state.grid.map((cell) => {
          const toMark = cellsToMark.some((cellToMark) =>
            areCellsEqual(cell, cellToMark)
          );
          return {
            ...cell,
            isMarkedForDestruction: toMark,
          };
        }),
      };
    case "destroy_marked_cells":
      const grid = state.grid.filter((cell) => !cell.isMarkedForDestruction);
      const cellsMarkedForDestruction = state.grid.filter(
        (cell) => cell.isMarkedForDestruction
      );
      const [repositionedGrid, wasUpdated] = repositionGrid(grid);

      let selectedCells = state.selectedCells;
      let selectedCellPosition = state.selectedCellPosition;
      if (wasUpdated && selectedCellPosition) {
        const newSelectedCellPosition =
          repositionedGrid.find(
            ({ row, col }) =>
              selectedCellPosition?.row === row &&
              selectedCellPosition?.col === col
          ) || null;
        selectedCells =
          newSelectedCellPosition &&
          selectedCellPosition.id !== newSelectedCellPosition.id
            ? getAdjacentWithSameColor(
                newSelectedCellPosition,
                repositionedGrid
              )
            : [];
        selectedCellPosition = newSelectedCellPosition;
      }

      // For every 50 destroyed bricks award bonus turns.
      const turns =
        cellsMarkedForDestruction.length > 50
          ? state.turns + Math.floor(state.turns / 50)
          : Math.max(state.turns - 1, 0);
      const gameState = turns > 0 ? state.gameState : GameState.LOST;

      return {
        ...state,
        turns,
        gameState,
        grid: repositionedGrid,
        selectedCells,
        selectedCellPosition,
        points: state.points + state.basePoints! * state.multiplier!,
        ...calculateScoreUpdate(selectedCells),
      };
    case "select_cells":
      if (
        state.selectedCells.some(
          ({ id }) => id === action.payload.cellPosition.id
        )
      ) {
        return state;
      }
      const newSelectedCells = action.payload
        ? action.payload.expandToAdjacent
          ? getAdjacentWithSameColor(action.payload.cellPosition, state.grid)
          : [action.payload.cellPosition]
        : [];
      const scoreUpdate = calculateScoreUpdate(newSelectedCells);
      return {
        ...state,
        selectedCellPosition: action.payload.cellPosition,
        selectedCells: newSelectedCells,
        ...scoreUpdate,
      };
    case "unselect_cells":
      return {
        ...state,
        selectedCells: [],
        selectedCellPosition: null,
        basePoints: null,
        multiplier: null,
      };
    case "set_wildcard":
      if (state.availableWildcards <= 0 || action.payload.isWildcard) {
        return state;
      }
      // TODO: Maybe just combine them?
      const updatedGrid = state.grid.map((cell) =>
        cell.id === action.payload.id
          ? {
              ...cell,
              color: Color._WILDCARD,
              isWildcard: true,
            }
          : cell
      );
      const updatedCells = state.selectedCells.map((cell) =>
        cell.id === action.payload.id
          ? {
              ...cell,
              color: Color._WILDCARD,
              isWildcard: true,
            }
          : cell
      );
      const updatedSelectedCellPosition =
        state.selectedCellPosition?.id === action.payload.id
          ? {
              ...state.selectedCellPosition,
              color: Color._WILDCARD,
              isWildcard: true,
            }
          : state.selectedCellPosition;
      const availableWildcards = state.availableWildcards - 1;
      return {
        ...state,
        grid: updatedGrid,
        selectedCells: updatedCells,
        selectedCellPosition: updatedSelectedCellPosition,
        availableWildcards,
        interactionMode:
          availableWildcards > 0
            ? state.interactionMode
            : InteractionMode.DEFAULT,
      };
    default:
      return state;
    case "reset":
      return createInitialState(action.payload);
  }
};

export const createInitialState = ({
  grid,
  wildcards,
  turns,
}: {
  grid: GridMapping;
  wildcards: number;
  turns: number;
}) => ({
  grid,
  selectedCells: [],
  selectedCellPosition: null,
  availableWildcards: wildcards,
  interactionMode: InteractionMode.DEFAULT,
  turns: turns,
  gameState: GameState.RUNNING,
  points: 0,
  basePoints: null,
  multiplier: null,
});

const calculateScoreUpdate = (selectedCells: GridCell[]) => {
  if (!selectedCells.length) {
    return {
      basePoints: null,
      multiplier: null,
    };
  }

  return {
    basePoints: selectedCells.length * 10,
    multiplier: Math.max(Math.floor(selectedCells.length / 10), 1),
  };
};
