import React from 'react'
import PropTypes from 'prop-types'
import {
  ScatterPlot,
  Axes,
} from '../parts'
import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'
import { scaleLinear } from '@vx/scale'
import { extent, max, bisector } from 'd3-array'
import { Group } from '@vx/group'

const ScatterPie = ({
  width,
  height,
  data,
  margin = {
    left: 50,
    top: 50,
    bottom: 50,
    right: 50,
  }
}) => {
  const xMax = width - margin.left
  const yMax = height - margin.top

  if (width < 10) return null

  const x = d => d[0]
  const y = d => d[1]

  // number of categories
  const xScale = scaleLinear({
    domain: extent(data, x),
    range: [0, xMax],
    clamp: true
  })

  const [min, max] = extent(data, y)

  // value of domain
  const yScale = scaleLinear({
    domain: [min, max],
    range: [yMax, 20],
    clamp: true
  })

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        <Group left={margin.left} bottom={margin.bottom}>
          <ScatterPlot 
            xGetter={x}
            yGetter={y}
            xScale={xScale}
            yScale={yScale}
            width={width - margin.left}
            height={height - margin.bottom}
            data={data}
            margin={margin}
            shapeSize={48}
          />
          <Axes
				      showAxisX={true}
				      showAxisY={true}
				      showGrid={false}
				      xMax={xMax}
				      yMax={yMax}
				      left={{
				        top: 0,
				        left: margin.left,
				        scale: yScale,
				        numTicks: numTicksForHeight(height),
				        label: 'population',
				      }}
				      bottom={{
				        top: height - margin.bottom,
				        left: margin.left,
				        scale: xScale,
				        numTicks: numTicksForWidth(width),
				        label: 'categories',
				      }}
				    />
        </Group>
      </svg>
			
    </React.Fragment>
  ) 
}

export default ScatterPie