import { Controls } from "./Controls";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { GameField } from "./GameField";
import {
  GameDefContext,
  GameStateContext,
  GameStateDispatcherContext,
} from "../reducer/GameStateContext";
import { GameState } from "../model/GameFieldModel";
import { GridMappingProviderContext } from "../mappingProvider/GridMappingProvider";
import { GameStateModal } from "./GameStateModal";

const StyledGameWrapper = styled.div`
  min-height: 100%;
  margin-top: 20px;
  justify-content: stretch;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 20px;
  grid-template-columns: 1fr max-content 20em 1fr;
  grid-column-gap: 30px;
  grid-template-areas: "left game controls right";
`;

export const GameWrapper = () => {
  const { gameState } = useContext(GameStateContext);
  const { rows, cols, wildcards, turns } = useContext(GameDefContext);
  const gridMappingProvider = useContext(GridMappingProviderContext);
  const dispatch = useContext(GameStateDispatcherContext);

  useEffect(() => {
    onGameStateChanged(gameState);
  }, [gameState]);

  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const onGameStateChanged = (gameState: GameState) => {
    switch (gameState) {
      case GameState.WON:
        setModalMessage("You won!");
        return;
      case GameState.LOST:
        setModalMessage("You lost!");
        return;
      default:
        return;
    }
  };

  const onRestart = () => {
    dispatch({
      type: "reset",
      payload: {
        grid: gridMappingProvider.generateMapping(rows, cols),
        wildcards,
        turns,
      },
    });
    setModalMessage(null);
  };

  return (
    <StyledGameWrapper>
      <Controls />
      <GameField />
      <GameStateModal
        show={!!modalMessage}
        message={modalMessage!}
        onRestart={onRestart}
      />
    </StyledGameWrapper>
  );
};
