import React from 'react'

import TimeSeriesContainer from './ts-container'
import BreakdownContainer from './b-container'
import ScatterPieContainer from './sp-container'

const App = () => (
  <React.Fragment>
    {false && <BreakdownContainer />}
    <TimeSeriesContainer />
    <ScatterPieContainer />
  </React.Fragment>
)

export default App
