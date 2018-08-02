import React from 'react'
import PropTypes from 'prop-types'

import { Pie } from '@vx/shape'

function Label({ x, y, children }) {
  return (
    <text
      fill='black'
      textAnchor='middle'
      x={x}
      y={y}
      fontSize={10}
    >
      {children}
    </text>
  )
}

const PieDonut = ({
  // required
  width,
  height,
  data,
  vGetter,
  // optional
  hollow=true,
}) => {
  const radius = Math.min(width, height) / 2
  const outerRadius = radius - 90
  const innerRadius = radius - radius / 1.37
  const opacity = (d) => 1 / (d.index + 1.7)
  const sort = (a, b) => {
    const diff = a - b
    if (diff > 0) {
      return -1
    }
    if (diff < 0) {
      return 1
    }
    return diff
  }

  return (
    <Pie
      data={data}
      pieValue={vGetter}
      outerRadius={outerRadius}
      innerRadius={hollow ? innerRadius : 0}
      // cornerRadius={0}
      // padAngle={0.005}
      fill='teal'
      fillOpacity={opacity}
      pieSortValues={sort}
      centroid={(centroid, arc) => {
        let [x, y] = centroid
        const { startAngle, endAngle, padAngle } = arc
        if (endAngle - startAngle - padAngle < .1) {
          return null
        }
        return (
          <Label
            x={x}
            y={y}
            children={`${arc.data.label}: ${arc.data.usage}%`}
          />
        )
      }}
    />
  )
}

PieDonut.propTypes = {
  // required
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  vGetter: PropTypes.func.isRequired,
  // optional
  hollow: PropTypes.bool,
}

PieDonut.defaultProps = {
  hollow: true,
}

export default PieDonut
