import { difference } from "../../utils/ListUtils";
import {
  areCellsEqual,
  getAdjacentWithSameColor,
  repositionGrid,
} from "../../utils/GameFieldUtils";
import { GridCell, GridMapping } from "../../model/GameFieldModel";

export type GridMappingAction =
  | {
      type: "remove_cells";
      payload: GridMapping;
    }
  | {
      type: "select_cells";
      payload: GridCell;
    }
  | { type: "unselect_cells" };
export const GridMappingReducer = (
  state: {
    grid: GridMapping;
    selectedCells: GridMapping;
    selectedCellPosition: GridCell | null;
  },
  action: GridMappingAction
) => {
  switch (action.type) {
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

      return { grid: repositionedGrid, selectedCells, selectedCellPosition };
    case "select_cells":
      if (state.selectedCells.some(({ id }) => id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        selectedCellPosition: action.payload,
        selectedCells: action.payload
          ? getAdjacentWithSameColor(action.payload, state.grid)
          : [],
      };
    case "unselect_cells":
      return { ...state, selectedCells: [], selectedCellPosition: null };
    default:
      return state;
  }
};
