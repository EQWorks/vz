import React from 'react'
import PropTypes from 'prop-types'

import { PatternLines } from '@vx/pattern'

const NoSpace = ({
  width,
  height,
  message
}) => (
  <svg width={width} height={height}>
    <text
      x={width / 2}
      y={height / 2}
      textAnchor='middle'
      alignmentBaseline='central'
    >
      {message}
    </text>
    <PatternLines
      id="lines"
      height={5}
      width={5}
      stroke={'black'}
      strokeWidth={1}
      orientation={['diagonal']}
    />
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={'url("#lines")'}
    />
  </svg>
)

NoSpace.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  message: PropTypes.string
}
NoSpace.defaultProps = {
  message: 'No space to display'
}

export default NoSpace
