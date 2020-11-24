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
      <div className="controls_info">
        <InfoBox>Turns left: {turns}</InfoBox>
        <InfoBox>
          <span>Points: {points} </span>
          {basePoints ? (
            <PointsUpdate>
              {" "}
              + {basePoints}{" "}
              {multiplier && multiplier > 1 ? " x " + multiplier : ""}
            </PointsUpdate>
          ) : null}
        </InfoBox>
      </div>
    </StyledControls>
  );
};

const StyledControls = styled.div`
  grid-area: controls;
  width: 100%;
  padding: 2em 1em;
  justify-self: center;
  border: 1px solid royalblue;
  border-radius: 0.7em;
  background-color: lightblue;

  display: grid;
  grid-template-rows: min-content 1fr;
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
  margin-top: 1em;
  font-size: 1em;
  color: white;
  padding: 2em 1em;
  border: 1px solid dodgerblue;
  border-radius: 0.5em;
  background-color: dodgerblue;
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

  position: absolute;
  left: 100px;
  top: 55px;
  animation-duration: 0.8s;
  animation-name: change-height;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;
