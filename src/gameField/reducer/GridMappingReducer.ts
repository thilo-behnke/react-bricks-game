import {
  GridCell,
  GridMapping,
  GridMappingAction,
} from "../../mappingProvider/GridMappingProvider";
import { difference } from "../../utils/ListUtils";
import {
  areCellsEqual,
  getAdjacentWithSameColor,
  repositionGrid,
} from "../../utils/GameFieldUtils";

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
      return {
        ...state,
        selectedCells: action.payload.cells,
        selectedCellPosition: action.payload.cellPosition,
      };
    case "unselect_cells":
      return { ...state, selectedCells: [], selectedCellPosition: null };
    default:
      return state;
  }
};
