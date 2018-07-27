import React from 'react'
import PropTypes from 'prop-types'

import { Bar } from '@vx/shape'

const HotZone = ({
  width,
  height,
  data,
  onMouseMove,
  onMouseLeave,
}) => (
  <Bar
    x={0}
    y={0}
    width={width}
    height={height}
    fill='transparent'
    data={data}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
  />
)

HotZone.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.any,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
}
HotZone.defaultProps = {
  data: [],
  onMouseMove: () => {},
  onMouseLeave: () => {},
}

export default HotZone
