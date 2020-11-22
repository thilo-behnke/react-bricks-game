import React from "react";
import "./App.css";
import { GameField } from "./gameField/GameField";
import styled from "styled-components";
import {
  GridMappingProviderContext,
  RandomGridMappingProvider,
  StaticGridMappingProvider,
} from "./mappingProvider/GridMappingProvider";

const GameWrapper = styled.div`
  min-height: 100%;
  justify-content: stretch;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 20px;
  grid-template-columns: 1fr minmax(min-content, 10fr) 1fr;
  grid-template-areas: "headerLeft header headerRight" "left game right" "footer footer footer";
`;

const StyledGameField = styled(GameField)`
  grid-area: game;
`;

function App() {
  const rows = 30;
  const cols = 30;
  const turns = 20;
  const wildcards = 2;

  return (
    <GridMappingProviderContext.Provider
      value={new RandomGridMappingProvider()}
    >
      <GameWrapper>
        <StyledGameField
          rows={rows}
          cols={cols}
          wildCards={wildcards}
          turns={turns}
        />
      </GameWrapper>
    </GridMappingProviderContext.Provider>
  );
}

export default App;
