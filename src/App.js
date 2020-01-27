import React from 'react';
// COMPONENTS
import ScoreCard from './ScoreCard';
// MATERIAL UI 
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
})

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ScoreCard /> 

      </ThemeProvider>
    </div>
  );
}

export default App;
