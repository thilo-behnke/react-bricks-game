import {
  GridMapping,
  GridMappingAction,
} from "../../mappingProvider/GridMappingProvider";
import { difference } from "../../utils/ListUtils";
import { areCellsEqual, repositionGrid } from "../../utils/GameFieldUtils";

export const GridMappingReducer = (
  state: { grid: GridMapping; selectedCells: GridMapping },
  action: GridMappingAction
) => {
  switch (action.type) {
    case "remove_cells":
      const { payload } = action;
      const grid = difference(state.grid, payload, areCellsEqual);
      const [repositionedGrid, wasUpdated] = repositionGrid(grid);
      const selectedCells = state.selectedCells
        .map(({ id }) => grid.find(({ id: cellId }) => id === cellId))
        .filter(Boolean) as GridMapping;
      return { grid: repositionedGrid, selectedCells };
    case "select_cells":
      return { ...state, selectedCells: action.payload };
    default:
      return state;
  }
};
