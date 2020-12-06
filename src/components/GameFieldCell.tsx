import React from "react";
import styled from "styled-components";
import { Color } from "../model/GameFieldModel";

export type GameFieldCellProps = {
  color?: Color;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  shouldDestroy?: boolean;
};

const Cell = styled.div`
  @keyframes vaporize-block {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(0);
    }
  }

  border: ${(props: GameFieldCellProps) => (props.isSelected ? "2px" : "1px")}
    solid ${(props: GameFieldCellProps) => (props.isSelected ? "red" : "grey")};
  background-color: ${(props: GameFieldCellProps) => props.color};
  animation: ${(props: GameFieldCellProps) =>
    props.shouldDestroy ? "vaporize-block 200ms linear" : "none"};
`;

export const GameFieldCell = (props: GameFieldCellProps) => {
  return <Cell {...props} />;
};
