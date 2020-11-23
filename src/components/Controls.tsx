import { InteractionMode } from "../reducer/GameStateReducer";
import React, { useContext } from "react";
import styled from "styled-components";
import {
  GameStateContext,
  GameStateDispatcherContext,
} from "../reducer/GameStateContext";

export const Controls = () => {
  const {
    availableWildcards,
    interactionMode,
    points,
    basePoints,
    multiplier,
    gameState,
    turns,
  } = useContext(GameStateContext);
  const dispatch = useContext(GameStateDispatcherContext);

  const toggleWildcardMode = () => {
    dispatch({
      type: "switch_interaction_mode",
      payload:
        interactionMode === InteractionMode.WILDCARD
          ? InteractionMode.DEFAULT
          : InteractionMode.WILDCARD,
    });
  };

  return (
    <StyledControls>
      <WildcardButton
        className="controls_wildcard"
        disabled={availableWildcards <= 0}
        onClick={toggleWildcardMode}
        wildcardActive={interactionMode === InteractionMode.WILDCARD}
      >
        {interactionMode === InteractionMode.DEFAULT
          ? "Set Wildcard (" + availableWildcards + " left)"
          : "Cancel"}
      </WildcardButton>
      <div className="controls_turns">Turns left: {turns}</div>
      <div className="controls_game-state">Game State: {gameState}</div>
      <div className="controls_points">
        Points: {points}{" "}
        {basePoints ? (
          <span>
            {" "}
            + {basePoints}{" "}
            {multiplier && multiplier > 1 ? " x " + multiplier : ""}
          </span>
        ) : null}
      </div>
    </StyledControls>
  );
};

const StyledControls = styled.div`
  grid-area: header;
  width: 100%;
  padding-top: 1em;
  justify-self: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  * + * {
    margin-left: 1em;
  }

  > :not(.controls_points):not(.controls_wildcard) {
    flex: 0 0 auto;
  }

  .controls_wildcard {
    flex: 0 0 200px;
  }

  .controls_points {
    flex: 0 0 300px;
  }
`;

type WildcardButtonProps = {
  wildcardActive: boolean;
};

const WildcardButton = styled.button`
  font-size: 1em;
  padding: 5px 10px;
  color: white;
  border: 1px solid
    ${(props: WildcardButtonProps) =>
      props.wildcardActive ? "darkred" : "dodgerblue"};
  background-color: ${(props: WildcardButtonProps) =>
    props.wildcardActive ? "darkred" : "dodgerblue"};
  border-radius: 4px;
  cursor: pointer;
`;
