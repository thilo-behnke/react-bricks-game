import React from "react";
import "./App.css";
import { GameField } from "./gameField/GameField";
import styled from "styled-components";
import { Color } from "./model/GameFieldModel";

const GameWrapper = styled.div`
  min-height: 100%;
  justify-content: stretch;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 20px;
  grid-template-columns: 1fr minmax(min-content, 10fr) 1fr;
  grid-template-areas: "header header header" "left game right" "footer footer footer";
`;

const StyledGameField = styled(GameField)`
  grid-area: game;
`;

function App() {
  const rows = 10;
  const cols = 10;
  return (
    <GameWrapper>
      <StyledGameField
        rows={rows}
        cols={cols}
        mapping={{ 0: { 0: { color: Color.BLUE } } }}
      />
    </GameWrapper>
  );
}

export default App;
