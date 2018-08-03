import React from 'react'
import PropTypes from 'prop-types'

import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'
import { Group } from '@vx/group'

import {
  NoSpace,
  Markers,
  PieDonut,
  // Axes,
  // HotZone,
} from '../parts'

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
  shape='donut',
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

  // accessors
  const kGetter = (d) => d.label // TODO: config
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

  const renderPieDonut = () => {
    return (
      <Group top={height / 2 - margin.top} left={width / 2}>
        <PieDonut
          width={width}
          height={height}
          data={data}
          kGetter={kGetter}
          vGetter={vGetter}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          hollow={shape === 'donut'}
        />
      </Group>
    )
  }

  const renderTooltip = () => {
    return tooltipOpen && (
      <React.Fragment key={Math.random()}>
        {tooltipData[metrics] > 0 && (
          <TooltipWithBounds
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              color: 'teal'
            }}
          >
            {`${kGetter(tooltipData)}: ${vGetter(tooltipData)}`}
          </TooltipWithBounds>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        {renderPieDonut()}
      </svg>
      {renderTooltip()}
    </React.Fragment>
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
  shape: PropTypes.string,
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
  shape: 'donut',
  // snapTooltip: true,
  minWidth: 600,
}

export default withParentSize(withTooltip(Breakdown))
