import React from 'react'
import { ScatterBasic } from '../src/visualizations'
import { GlyphDot } from '@vx/glyph'

const data = [{"label": "Education", "value_total": 0}, {"label": "Visual and Performing Arts", "value_total": 0}, {"label": "Humanities", "value_total": 0}, {"label": "Sociology and Law", "value_total": 15}, {"label": "Business and PA", "value_total": 10}, {"label": "Phys Ed", "value_total": 0}, {"label": "Math, Comp and InfoSci", "value_total": 0}, {"label": "Engineering", "value_total": 10}, {"label": "Agriculture, NatRes", "value_total": 0}, {"label": "Health", "value_total": 25}, {"label": "Security", "value_total": 0}, {"label": "Other", "value_total": 0}]

const scatterData = data.map((d) => {
  return {
    fieldName: d.label,
    value: d.value_total,
  }
})


const drawAScatter = (left, top) => {
    return (
      <GlyphDot
        key={Math.random()}
        cx={left}
        cy={top}
        stroke='#008080'
        fill='#b3ffff'
        strokeWidth={1}
        r={4}
      />
    )
  }

class ScatterBasicContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{'height': '400'}}>
        <ScatterBasic
          drawAScatter={drawAScatter}
          data={scatterData}
          yAxisLabel='Population'
          xAxisLabel='Program'
        />
      </div>
    )
  }
}

export default ScatterBasicContainer
