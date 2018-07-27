import React from 'react'
import PropTypes from 'prop-types'

const Background = ({
  width,
  height,
}) => (
  <rect
    x={0}
    y={0}
    width={width}
    height={height}
  />
)

Background.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Background
