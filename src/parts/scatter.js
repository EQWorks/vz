import React from 'react'
import PropTypes from 'prop-types'

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

Scatter.propTypes = {
  data: PropTypes.array.isRequired,
  scatterShape: PropTypes.func.isRequired,

}
export default Scatter
