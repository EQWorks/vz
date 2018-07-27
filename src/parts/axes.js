import React from 'react'
import PropTypes from 'prop-types'

import { AxisLeft, AxisBottom } from '@vx/axis'
import { Grid } from '@vx/grid'

const Axes = ({
  showGrid,
  xMax,
  yMax,
  left,
  bottom,
  // right,
}) => (
  <g>
    {showGrid && (
      <Grid
        xScale={bottom.scale}
        yScale={left.scale}
        width={xMax}
        height={yMax}
        numTicksRows={left.numTicks}
        numTicksColumns={bottom.numTicks}
      />
    )}
    <AxisLeft
      top={left.top}
      left={left.left}
      scale={left.scale}
      numTicks={left.numTicks}
      label={left.label}
    />
    <AxisBottom
      top={bottom.top}
      left={bottom.left}
      scale={bottom.scale}
      numTicks={bottom.numTicks}
      label={bottom.label}
    />
  </g>
)

Axes.propTypes = {
  showGrid: PropTypes.bool,
  xMax: PropTypes.number,
  yMax: PropTypes.number,
  left: PropTypes.object.isRequired,
  bottom: PropTypes.object.isRequired,
  // right: PropTypes.object,
}
Axes.defaultProps = {
  showGrid: true,
  xMax: 0,
  yMax: 0,
}

export default Axes
