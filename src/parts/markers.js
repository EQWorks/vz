import React from 'react'
import PropTypes from 'prop-types'

import { Line } from '@vx/shape'

const Markers = ({
  showHorizontal,
  showVertical,
  x,
  y,
  xMax,
  yMax,
}) => (
  <React.Fragment>
    {showHorizontal && (
      <Line
        from={{ x: 0, y }}
        to={{ x: xMax, y }}
        stroke='teal'
        strokeWidth={1}
        style={{ pointerEvents: 'none' }}
        strokeDasharray='2,2'
      />
    )}
    {showVertical && (
      <Line
        from={{ x, y: 0 }}
        to={{ x, y: yMax }}
        stroke='teal'
        strokeWidth={1}
        style={{ pointerEvents: 'none' }}
        strokeDasharray='2,2'
      />
    )}
  </React.Fragment>
)

Markers.propTypes = {
  showHorizontal: PropTypes.bool,
  showVertical: PropTypes.bool,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  xMax: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
}
Markers.defaultProps = {
  showHorizontal: true,
  showVertical: true,
}

export default Markers
