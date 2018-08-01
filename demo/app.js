import React from 'react'

import TimeSeriesContainer from './ts-container'
import BreakdownContainer from './b-container'

import { Breakdown } from '../src/visualizations'

const App = () => (
  <React.Fragment>
    <BreakdownContainer />
    <TimeSeriesContainer />
  </React.Fragment>
)

export default App
