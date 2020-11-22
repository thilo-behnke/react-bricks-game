import {
  GridMapping,
  GridMappingAction,
} from "../../mappingProvider/GridMappingProvider";

export const GridMappingReducer = (
  state: GridMapping,
  action: GridMappingAction
) => {
  switch (action.type) {
    case "remove_cell":
      const {
        payload: { row: cellRow, col: cellCol },
      } = action;
      return state.filter(({ row, col }) => row !== cellRow || col !== cellCol);
    default:
      return state;
  }
};
