import React from "react";
import styled from "styled-components";

export type FeedbackProps = {
  nrRemovedCells: number;
};

export enum FeedbackType {
  NICE,
  EPIC,
  LEGENDARY,
}

export const Feedback = (props: FeedbackProps) => {
  const { nrRemovedCells } = props;
  if (nrRemovedCells < 10) {
    return null;
  } else if (nrRemovedCells >= 15 && nrRemovedCells < 30) {
    return (
      <StyledFeedback feedbackType={FeedbackType.NICE}>Nice!</StyledFeedback>
    );
  } else if (nrRemovedCells >= 30 && nrRemovedCells < 70) {
    return (
      <StyledFeedback feedbackType={FeedbackType.EPIC}>Epic!</StyledFeedback>
    );
  } else if (nrRemovedCells >= 70) {
    return (
      <StyledFeedback feedbackType={FeedbackType.LEGENDARY}>
        Legendary!
      </StyledFeedback>
    );
  }
  return null;
};

type StyledFeedbackProps = {
  feedbackType: FeedbackType;
};

const StyledFeedback = styled.div`
  @keyframes show-feedback {
    0% {
      display: block;
      transform: scale(1);
    }
    20% {
      transform: scale(0.8);
    }
    80% {
      transform: scale(5);
    }
    100% {
      display: none;
      transform: scale(0);
    }
  }

  color: white;
  padding: 0.5em 1em;
  background-color: ${(props: StyledFeedbackProps) =>
    getColorForFeedbackType(props.feedbackType)};
  border: 1px white solid;
  border-radius: 0.5em;

  position: absolute;
  top: 50%;
  left: ${(props: StyledFeedbackProps) =>
    getPositionForFeedbackType(props.feedbackType)}%;
  animation: show-feedback 1s forwards;
`;

const getColorForFeedbackType = (feedbackType: FeedbackType) => {
  switch (feedbackType) {
    case FeedbackType.LEGENDARY:
      return "orange";
    case FeedbackType.EPIC:
      return "purple";
    case FeedbackType.NICE:
      return "blue";
    default:
      return "white";
  }
};

const getPositionForFeedbackType = (feedbackType: FeedbackType) => {
  switch (feedbackType) {
    case FeedbackType.LEGENDARY:
      return 42;
    case FeedbackType.EPIC:
      return 45;
    case FeedbackType.NICE:
      return 45;
    default:
      return 50;
  }
};
