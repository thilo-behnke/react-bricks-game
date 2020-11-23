import React from "react";
import "./App.css";
import {
  ClusteringRandomGridMappingProvider,
  GridMappingProviderContext,
} from "./mappingProvider/GridMappingProvider";
import { GameProvider } from "./reducer/GameStateContext";
import { GameWrapper } from "./components/GameWrapper";

const gridMappingProvider = new ClusteringRandomGridMappingProvider();

function App() {
  const rows = 20;
  const cols = 20;
  const turns = 20;
  const wildcards = 5;

  return (
    <GameProvider
      grid={gridMappingProvider.generateMapping(rows, cols)}
      turns={turns}
      wildcards={wildcards}
      rows={rows}
      cols={cols}
    >
      <GridMappingProviderContext.Provider value={gridMappingProvider}>
        <GameWrapper />
      </GridMappingProviderContext.Provider>
    </GameProvider>
  );
}

export default App;
