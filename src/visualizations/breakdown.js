import React from 'react'
import PropTypes from 'prop-types'

import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'

import { Pie } from '@vx/shape'
import { Group } from '@vx/group'

import {
  NoSpace,
  Markers,
  // Axes,
  // HotZone,
} from '../parts'

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

const Breakdown = ({
  // withParentSize
  parentWidth: width,
  parentHeight: height,
  // withTooltip
  showTooltip,
  hideTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  // required
  data,
  metrics,
  // optional
  margin={
    left: 100,
    top: 50,
    right: 100,
    bottom: 50,
  },
  minWidth=600,
}) => {
  if (width < minWidth) {
    return (
      <NoSpace
        width={width}
        height={height}
      />
    )
  }

  const radius = Math.min(width, height) / 2
  const outerRadius = radius - 90
  const innerRadius = radius - radius / 1.37

  // accessors
  const vGetter = (d) => d[metrics]
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
    <svg width={width} height={height}>
      <Group top={height / 2 - margin.top} left={width / 2}>
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
              <Label
                x={x}
                y={y}
                children={`${arc.data.label}: ${arc.data.usage}%`}
              />
            )
          }}
        />
      </Group>
    </svg>
  )
}

Breakdown.propTypes = {
  // withParentSize
  parentWidth: PropTypes.number.isRequired,
  parentHeight: PropTypes.number.isRequired,
  // withTooltip
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  tooltipOpen: PropTypes.bool.isRequired,
  tooltipTop: PropTypes.number,
  tooltipLeft: PropTypes.number,
  tooltipData: PropTypes.any,
  // required
  data: PropTypes.array.isRequired,
  metrics: PropTypes.string.isRequired,
  // optional
  margin: PropTypes.object,
  // snapTooltip: PropTypes.bool,
  minWidth: PropTypes.number,
}

Breakdown.defaultProps = {
  margin: {
    left: 100,
    top: 50,
    right: 100,
    bottom: 50,
  },
  // snapTooltip: true,
  minWidth: 600,
}

export default withParentSize(withTooltip(Breakdown))
