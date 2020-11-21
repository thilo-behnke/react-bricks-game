import React from "react";
import styled from "styled-components";
import { Color } from "../model/GameFieldModel";

export type GameFieldCellProps = {
  color?: Color;
  onClick: () => void;
};

const Cell = styled.div`
  border: 1px solid black;
  background-color: ${(props) => props.color};
`;

export const GameFieldCell = (props: GameFieldCellProps) => {
  return <Cell onClick={props.onClick} color={props.color?.toString()} />;
};
