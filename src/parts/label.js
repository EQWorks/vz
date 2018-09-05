import React from 'react'
import PropTypes from 'prop-types'

const Label = ({ x, y, children }) => {
  return (
    <text
      fill='black'
      textAnchor='middle'
      x={x}
      y={y}
      style={{
        fontSize: '0.9rem',
      }}
    >
      {children}
    </text>
  )
}

Label.propTypes = {
  // required
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
}

export default Label
