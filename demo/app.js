import React from 'react'

import TimeSeriesContainer from './ts-container'
import ScatterPieContainer from './sp-container'
import ScatterBasicContainer from './sb-container'

const App = () => (
  <React.Fragment>
    <TimeSeriesContainer />
    <ScatterPieContainer />
    <ScatterBasicContainer />
  </React.Fragment>
)

export default App
