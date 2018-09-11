import React from 'react'
import PropTypes from 'prop-types'

import { AxisLeft, AxisBottom } from '@vx/axis'
import { Grid } from '@vx/grid'

const Axes = ({
  showAxisX,
  showAxisY,
  showGrid,
  xMax,
  yMax,
  left,
  bottom,
  // right,
}) => (
  <React.Fragment>
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
    {showAxisY && <AxisLeft
      top={left.top}
      left={left.left}
      scale={left.scale}
      numTicks={left.numTicks}
      hideTicks={left.hideTicks}
      label={left.label}
    />}
    {showAxisX && <AxisBottom
      top={bottom.top}
      left={bottom.left}
      scale={bottom.scale}
      numTicks={bottom.numTicks}
      hideTicks={bottom.hideTicks}
      label={bottom.label}
    />}
  </React.Fragment>
)

Axes.propTypes = {
  showAxisX: PropTypes.bool,
  showAxisY: PropTypes.bool,
  showGrid: PropTypes.bool,
  xMax: PropTypes.number,
  yMax: PropTypes.number,
  left: PropTypes.object.isRequired,
  bottom: PropTypes.object.isRequired,
  // right: PropTypes.object,
}
Axes.defaultProps = {
  showAxisX: true,
  showAxisY: true,
  showGrid: true,
  xMax: 0,
  yMax: 0,
}

export default Axes
