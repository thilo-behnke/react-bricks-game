export enum Color {
  YELLOW = "yellow",
  BLUE = "blue",
  GREEN = "green",
  ORANGE = "orange",
  _WILDCARD = "purple",
}

export type GridCell = {
  id: number;
  row: number;
  col: number;
  color: Color;
  isWildcard?: boolean;
  isMarkedForDestruction?: boolean;
};
export type GridMapping = Array<GridCell>;

export enum GameState {
  RUNNING = "RUNNING",
  WON = "WON",
  LOST = "LOST",
}
