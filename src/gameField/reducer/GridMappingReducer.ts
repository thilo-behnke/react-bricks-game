import {
  GridMapping,
  GridMappingAction,
} from "../../mappingProvider/GridMappingProvider";
import { difference } from "../../utils/ListUtils";
import { areCellsEqual } from "../../utils/GameFieldUtils";

export const GridMappingReducer = (
  state: GridMapping,
  action: GridMappingAction
) => {
  switch (action.type) {
    case "remove_cells":
      const { payload } = action;
      return difference(state, payload, areCellsEqual);
    case "update_grid":
      return action.payload;
    default:
      return state;
  }
};
