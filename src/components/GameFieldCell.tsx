import React from "react";
import styled from "styled-components";
import { Color } from "../model/GameFieldModel";

export type GameFieldCellProps = {
  color?: Color;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const Cell = styled.div`
  border: ${(props: GameFieldCellProps) => (props.isSelected ? "2px" : "1px")}
    solid ${(props: GameFieldCellProps) => (props.isSelected ? "red" : "grey")};
  background-color: ${(props: GameFieldCellProps) => props.color};
`;

export const GameFieldCell = (props: GameFieldCellProps) => {
  return <Cell {...props} />;
};
