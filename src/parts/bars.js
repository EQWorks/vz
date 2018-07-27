import React from 'react'
import PropTypes from 'prop-types'

import { Bar } from '@vx/shape'

const Bars = ({
  xMax,
  yMax,
  barWidth,
  data,
  xGetter,
  yGetter,
  xScale,
  yScale,
  color
}) => {
  // TODO: memoize this?
  const getBarProps = (d) => {
    // y-axis value
    const y = yGetter(d)
    const yValue = yScale(y)
    // x-axis value, centered on tick
    let xValue = xScale(xGetter(d)) - barWidth / 2
    // bar width
    let width = barWidth

    if (xValue < 0) {
      // first data point
      // half of regular width
      width = Math.max(width / 2, 2)
      // shift to right side of left y-axis
      xValue = xValue + width
    } else if (xValue === xMax - width / 2) {
      // last data point
      // half of regular width
      width = Math.max(width / 2, 2)
    } else {
      width = Math.max(width, 2)
    }

    return {
      width,
      xValue,
      yValue
    }
  }
  return (
    <g>
      {data.map((d) => {
        const { width, xValue, yValue } = getBarProps(d)
        const barHeight = yMax - yValue
        return (
          <Bar
            key={`bar-${xGetter(d)}`}
            width={width}
            height={barHeight}
            x={xValue}
            y={yValue}
            fill={color(d)}
            fillOpacity={0.3}
            stroke={color(d)}
            strokeWidth={0.7}
          />
        )
      })}
    </g>
  )
}

Bars.propTypes = {
  xMax: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
  barWidth: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  xGetter: PropTypes.func.isRequired,
  yGetter: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  color: PropTypes.func.isRequired
}

export default Bars
