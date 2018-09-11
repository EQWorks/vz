import React from 'react'
import PropTypes from 'prop-types'

import { Bar, Pie } from '@vx/shape'

const HotZone = ({
  shape,
  data,
  onMouseMove,
  onMouseLeave,
  onClick,
  //pie props
  diameter,
  hollow,
  vGetter,
  left,
  top,
  // bar props
  width,
  height,
}) => {
  if (shape === 'bar') {
    return (
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
    )} else if (shape === 'pie') {
    return (
      <Pie
        data={data}
        width={diameter}
        height={diameter}
        outerRadius={diameter / 2}
        innerRadius={hollow ? diameter / 2 - diameter / 2.74 : 0}
        pieValue={vGetter}
        left={left}
        top={top}
        fill='transparent'
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    )}
}

HotZone.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.any,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
}
HotZone.defaultProps = {
  width: 10,
  height: 10,
  data: [],
  onMouseMove: () => {},
  onMouseLeave: () => {},
}

export default HotZone
