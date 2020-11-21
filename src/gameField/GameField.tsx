import React from "react";
import styled from "styled-components";
import { zipRange } from "../utils/ListUtils";
import { GameFieldCell } from "./GameFieldCell";
import { Color } from "../model/GameFieldModel";

export type GameFieldProps = {
  rows: number;
  cols: number;
  mapping: CellMapping;
};

export type CellMapping = {
  [row: number]: { [col: number]: { color: Color } };
};

const Grid = styled.div`
  justify-self: center;
  display: grid;
  grid-template-rows: repeat(${(props: GameFieldProps) => props.rows}, 2em);
  grid-template-columns: repeat(${(props: GameFieldProps) => props.cols}, 2em);
`;

export const GameField = (props: GameFieldProps) => {
  return (
    <Grid {...props}>
      {zipRange(props.rows, props.cols).map(([row, col]) => {
        return (
          <GameFieldCell
            key={`${row}/${col}`}
            color={props.mapping[row]?.[col]?.color}
          />
        );
      })}
    </Grid>
  );
};
