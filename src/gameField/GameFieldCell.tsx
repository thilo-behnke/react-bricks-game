import React from "react";
import styled from "styled-components";
import { Color } from "../model/GameFieldModel";

export type GameFieldCellProps = {
  color?: Color;
};

const Cell = styled.div`
  border: 1px solid black;
  background-color: ${(props) => props.color};
`;

export const GameFieldCell = (props: GameFieldCellProps) => {
  return <Cell color={props.color?.toString()} />;
};
