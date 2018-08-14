import React from 'react'
import MultiDimData from './mock-data/multi-dim'
import { ScatterPie } from '../src/visualizations'

const scatterData = Object.keys(MultiDimData[0]).filter(
  k => k !== 'f1' && k !== 'f2'
).map(
  (k,i) => [i, MultiDimData[0][k]]
)

console.log(scatterData)

class ScatterPieContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ScatterPie
        data={scatterData}
        width={700}
        height={500}
      />
    )
  }
}

export default ScatterPieContainer