export enum Color {
  YELLOW = "yellow",
  BLUE = "blue",
  GREEN = "green",
  ORANGE = "orange",
}

export type GridCell = {
  id: number;
  row: number;
  col: number;
  color: Color;
};
export type GridMapping = Array<GridCell>;
