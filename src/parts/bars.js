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
  colorFunc,
}) => {
  // TODO: memoize this?
  const getBarProps = (d) => {
    // y-axis value
    const y = yScale(yGetter(d))
    // x-axis value, centered on tick
    let x = xScale(xGetter(d)) - barWidth / 2
    // bar width
    let width = barWidth

    if (x < 0) {
      // first data point
      // half of regular width
      width = Math.max(width / 2, 2)
      // shift to right side of left y-axis
      x += width
    } else if (x === xMax - width / 2) {
      // last data point
      // half of regular width
      width = Math.max(width / 2, 2)
    } else {
      width = Math.max(width, 2)
    }

    return {
      width,
      height: yMax - y,
      x,
      y,
      color: colorFunc(d),
    }
  }
  return (
    <g>
      {data.map((d, i) => {
        const {
          width,
          height,
          x,
          y,
          color,
        } = getBarProps(d)
        return (
          <Bar
            key={`bar-${i}`}
            width={width}
            height={height}
            x={x}
            y={y}
            fill={color}
            fillOpacity={0.3}
            stroke={color}
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
  colorFunc: PropTypes.func.isRequired,
}

export default Bars
