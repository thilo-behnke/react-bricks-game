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
      <div className="controls_info">
        <InfoBox>Turns left: {turns}</InfoBox>
        <InfoBox>
          {points}
          {basePoints ? (
            <PointsUpdate>
              {" "}
              + {basePoints}{" "}
              {multiplier && multiplier > 1 ? " x " + multiplier : ""}
            </PointsUpdate>
          ) : null}
        </InfoBox>
      </div>
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
    </StyledControls>
  );
};

const StyledControls = styled.div`
  grid-area: controls;
  width: 100%;
  padding: 2em 1em;
  justify-self: center;
  border: 1px solid black;
  border-radius: 0.7em;

  display: grid;
  grid-template-rows: 1fr min-content;
  grid-row-gap: 30px;
`;

type WildcardButtonProps = {
  wildcardActive: boolean;
};

const WildcardButton = styled.button`
  font-size: 1em;
  padding: 5px 10px;
  color: white;
  height: 4em;
  box-shadow: 5px 5px 9px -4px #000000;
  border: 1px solid
    ${(props: WildcardButtonProps) =>
      props.wildcardActive ? "darkred" : "royalblue"};
  background-color: ${(props: WildcardButtonProps) =>
    props.wildcardActive ? "darkred" : "royalblue"};
  border-radius: 4px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  font-size: 2em;
  margin-top: 1em;
  padding: 20px 10px;
  border: 1px solid black;
  border-radius: 0.2em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  position: relative;
`;

const PointsUpdate = styled.span`
  @keyframes change-height {
    from {
      font-size: 1em;
      bottom: 35px;
    }

    to {
      font-size: 1.5em;
      bottom: 25px;
    }
  }

  color: red;
  position: absolute;
  left: 180px;
  top: 15px;
  animation-duration: 0.8s;
  animation-name: change-height;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;
