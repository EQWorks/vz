import React from 'react'
import MultiDimData from './mock-data/multi-dim'
import { ScatterPie } from '../src/visualizations'

const scatterData = Object.keys(MultiDimData[0])
  .filter(k => k === 'f2'
  || k === 'f6' || k === 'f10' || k === 'f14')
  .map(k =>
    MultiDimData.map(arr =>
    {

      const cur = parseInt(k.split('f')[1])
      const cur_1 = Math.min(cur + 1, 17)
      const cur_2 = Math.min(cur + 2, 17)
      const cur_3 = Math.min(cur + 3, 17)

      return {
        fieldName: arr['f1'],
        value: arr[k] + arr[`f${cur_1}`] + arr[`f${cur_2}`] + arr[`f${cur_3}`]
      }
    }
    )
  )


class ScatterPieContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ScatterPie
        data={scatterData}
        width={1200}
        height={600}
      />
    )
  }
}

export default ScatterPieContainer
