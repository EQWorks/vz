import React from 'react'
import PropTypes from 'prop-types'

import { Pie } from '@vx/shape'
import { localPoint } from '@vx/event'

function Label({ x, y, children }) {
  return (
    <text
      fill='black'
      textAnchor='middle'
      x={x}
      y={y}
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
  kGetter,
  vGetter,
  showTooltip,
  hideTooltip,
  // optional
  hollow=true,
  // snapTooltip=true,
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

  const handleTooltip = ({ data, event }) => {
    const point = localPoint(event)
    const xDomain = xScale.invert(point.x - margin.left)
    const index = bisectDate(data, xDomain, 1)
    const dLeft = data[index - 1]
    const dRight = data[index]
    let d = dLeft
    if (dRight && dRight.date) {
      d = xDomain - (new Date(dLeft.date)) > (new Date(dRight.date)) - xDomain ? dRight : dLeft
    }
    const tip = {
      tooltipData: d,
      tooltipLeft: xScale(d.date),
      tooltipTop: yScale(d[metrics]),
    }
    if (!snapTooltip) {
      Object.assign(tip, {
        tooltipLeft: point.x - margin.left,
        tooltipTop: point.y - margin.top,
      })
    }
    showTooltip(tip)
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
            children={`${kGetter(arc.data)}: ${vGetter(arc.data)}`}
          />
        )
      }}
      onMouseMove={(arc) => (event) => {
        const { data: tooltipData, centroid } = arc
        const point = localPoint(event)
        showTooltip({
          tooltipData,
          tooltipLeft: point.x,
          tooltipTop: point.y,
        })
      }}
      onMouseLeave={() => () => { hideTooltip() }}
    />
  )
}

PieDonut.propTypes = {
  // required
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  kGetter: PropTypes.func.isRequired,
  vGetter: PropTypes.func.isRequired,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  // optional
  hollow: PropTypes.bool,
  // snapTooltip: PropTypes.bool,
}

PieDonut.defaultProps = {
  hollow: true,
  // snapTooltip: true,
}

export default PieDonut
