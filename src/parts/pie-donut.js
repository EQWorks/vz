import React from 'react'
import PropTypes from 'prop-types'

import { Pie } from '@vx/shape'
import { localPoint } from '@vx/event'

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
  const innerRadius = hollow ? radius - radius / 1.37 : 0
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
      innerRadius={innerRadius}
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
          <text
            fill='black'
            textAnchor='middle'
            x={x}
            y={y}
            style={{
              fontSize: '0.9rem'
            }}
          >
            {`${kGetter(arc.data)}: ${vGetter(arc.data)}`}
          </text>
        )
      }}
      onMouseMove={(arc) => (event) => {
        const point = localPoint(event)

        showTooltip({
          tooltipData: {
            ...arc,
            // TODO: hack to resolve 0 startAngle issue
            startAngle: arc.startAngle ? arc.startAngle : 0.000000000001,

            innerRadius: innerRadius ? innerRadius : 0.000000000001,

            outerRadius,
          },
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
