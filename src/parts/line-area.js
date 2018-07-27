import React from 'react'
import PropTypes from 'prop-types'

import { curveMonotoneX } from '@vx/curve'
import { LinePath, AreaClosed } from '@vx/shape'
import { GlyphDot } from '@vx/glyph'

const LineArea = ({
  showArea,
  data,
  xGetter,
  yGetter,
  xScale,
  yScale,
  colorFunc,
}) => {
  const renderLine = () => (
    <LinePath
      data={data}
      xScale={xScale}
      yScale={yScale}
      x={xGetter}
      y={yGetter}
      stroke={colorFunc()}
      strokeWidth={1}
      curve={curveMonotoneX}
      glyph={(d, i) => (
        <GlyphDot
          key={`line-point-${i}`}
          cx={xScale(xGetter(d))}
          cy={yScale(yGetter(d))}
          r={yGetter(d) ? 3 : 1}
          fill={colorFunc(d)}
          fillOpacity={yGetter(d) ? 0.7 : 0.3}
        />
      )}
    />
  )

  const renderArea = () => (
    <AreaClosed
      data={data}
      xScale={xScale}
      yScale={yScale}
      x={xGetter}
      y={yGetter}
      fill={colorFunc()}
      fillOpacity={0.3}
      stroke="transparent"
      strokeWidth={0}
      curve={curveMonotoneX}
    />
  )

  return (
    <g>
      {renderLine()}
      {showArea && renderArea()}
    </g>
  )
}

LineArea.propTypes = {
  data: PropTypes.array.isRequired,
  xGetter: PropTypes.func.isRequired,
  yGetter: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  colorFunc: PropTypes.func.isRequired,
  showArea: PropTypes.bool,
}
LineArea.defaultProps = {
  showArea: true,
}

export default LineArea
