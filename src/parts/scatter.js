import React from 'react'
import PropTypes from 'prop-types'
import { GlyphCircle } from '@vx/glyph'


const ScatterPlot = ({
	width,
	height,
	data,
	xGetter,
	yGetter,
	xScale,
	yScale,
	shapeSize,
}) => {
	return (
		<React.Fragment>
			{data.map((pt, i) => {
				return (
					<GlyphCircle
		                className="dot"
		                key={`point-${xGetter(pt)}-${i}`}
		                fill={'#f6c431'}
		                left={xScale(xGetter(pt))}
		                top={yScale(yGetter(pt))}
		                size={shapeSize}
		            />
				)
			})}
		</React.Fragment>		
	)
}

export default ScatterPlot