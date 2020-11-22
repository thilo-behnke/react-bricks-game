import { difference } from "../../utils/ListUtils";
import {
  areCellsEqual,
  getAdjacentWithSameColor,
  repositionGrid,
} from "../../utils/GameFieldUtils";
import {
  Color,
  GameState,
  GridCell,
  GridMapping,
} from "../../model/GameFieldModel";

export type GridMappingState = {
  grid: GridMapping;
  selectedCells: GridMapping;
  selectedCellPosition: GridCell | null;

  gameState: GameState;
  availableWildcards: number;
  turns: number;
  interactionMode: InteractionMode;
  points: number;
};

export enum InteractionMode {
  DEFAULT = "DEFAULT",
  WILDCARD = "WILDCARD",
}

export type GridMappingAction =
  | {
      type: "remove_cells";
      payload: GridMapping;
    }
  | {
      type: "select_cells";
      payload: { cellPosition: GridCell; expandToAdjacent: boolean };
    }
  | { type: "unselect_cells" }
  | { type: "set_wildcard"; payload: GridCell }
  | { type: "switch_interaction_mode"; payload: InteractionMode }
  | { type: "decrement_turns" }
  | { type: "add_points"; payload: number };
export const GridMappingReducer = (
  state: GridMappingState,
  action: GridMappingAction
): GridMappingState => {
  switch (action.type) {
    case "switch_interaction_mode":
      return { ...state, interactionMode: action.payload };
    case "remove_cells":
      const { payload } = action;
      const grid = difference(state.grid, payload, areCellsEqual);
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

      return {
        ...state,
        grid: repositionedGrid,
        selectedCells,
        selectedCellPosition,
      };
    case "select_cells":
      if (
        state.selectedCells.some(
          ({ id }) => id === action.payload.cellPosition.id
        )
      ) {
        return state;
      }
      return {
        ...state,
        selectedCellPosition: action.payload.cellPosition,
        selectedCells: action.payload
          ? action.payload.expandToAdjacent
            ? getAdjacentWithSameColor(action.payload.cellPosition, state.grid)
            : [action.payload.cellPosition]
          : [],
      };
    case "unselect_cells":
      return { ...state, selectedCells: [], selectedCellPosition: null };
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
      return {
        ...state,
        grid: updatedGrid,
        selectedCells: updatedCells,
        selectedCellPosition: updatedSelectedCellPosition,
        availableWildcards: state.availableWildcards - 1,
        interactionMode: InteractionMode.DEFAULT,
      };
    case "decrement_turns":
      const turns = Math.max(state.turns - 1, 0);
      const gameState = turns > 0 ? state.gameState : GameState.LOST;
      return {
        ...state,
        gameState,
        turns,
      };
    case "add_points":
      return {
        ...state,
        points: state.points + action.payload,
      };
    default:
      return state;
  }
};
