import React from 'react'
import PropTypes from 'prop-types'
import { GlyphCircle } from '@vx/glyph'

const Scatter = ({
  scatterShape,
  data
}) => {
  return (
    <React.Fragment>
      {data.map((d, i) => scatterShape(d, i))}
    </React.Fragment>
  )
}

export default Scatter
