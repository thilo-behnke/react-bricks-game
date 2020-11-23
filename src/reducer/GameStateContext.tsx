import {
  BricksGameDef,
  BricksGameState,
  createInitialState,
  GameStateReducer,
  GridMappingAction,
} from "./GameStateReducer";
import React, { Dispatch, ReactElement } from "react";
import { GridMapping } from "../model/GameFieldModel";

export const GameDefContext = React.createContext<BricksGameDef>({
  rows: 0,
  cols: 0,
  wildcards: 0,
  turns: 0,
});

export const GameStateContext = React.createContext<BricksGameState>(
  createInitialState({
    grid: [],
    wildcards: 0,
    turns: 0,
  })
);

export const GameStateDispatcherContext = React.createContext<
  Dispatch<GridMappingAction>
>(() => {});

export type GameProviderProps = {
  children: ReactElement[] | ReactElement;
  grid: GridMapping;
  wildcards: number;
  turns: number;
};

export const GameProvider = ({
  children,
  grid,
  wildcards,
  turns,
  rows,
  cols,
}: GameProviderProps & BricksGameDef) => {
  const [state, dispatch] = React.useReducer(
    GameStateReducer,
    { grid, wildcards, turns },
    createInitialState
  );
  return (
    <GameDefContext.Provider value={{ rows, cols, wildcards, turns }}>
      <GameStateContext.Provider value={state}>
        <GameStateDispatcherContext.Provider value={dispatch}>
          {children}
        </GameStateDispatcherContext.Provider>
      </GameStateContext.Provider>
    </GameDefContext.Provider>
  );
};
