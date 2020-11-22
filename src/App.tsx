import React from "react";
import "./App.css";
import { GameField } from "./gameField/GameField";
import styled from "styled-components";
import {
  ClusteringRandomGridMappingProvider,
  GridMappingProviderContext,
} from "./mappingProvider/GridMappingProvider";

const GameWrapper = styled.div`
  min-height: 100%;
  justify-content: stretch;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 20px;
  grid-template-columns: 1fr minmax(min-content, 2fr) 1fr;
  grid-template-areas: "headerLeft header headerRight" "left game right" "footer footer footer";
`;

const StyledGameField = styled(GameField)`
  grid-area: game;
`;

function App() {
  const rows = 20;
  const cols = 20;
  const turns = 20;
  const wildcards = 5;

  return (
    <GridMappingProviderContext.Provider
      value={new ClusteringRandomGridMappingProvider()}
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
