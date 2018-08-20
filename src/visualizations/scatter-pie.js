import React from 'react'
import PropTypes from 'prop-types'
import {
  Scatter,
  Axes,
  PieDonut,
} from '../parts'
import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'
import { scaleLinear, scaleBand } from '@vx/scale'
import { extent, max, bisector } from 'd3-array'
import { Group } from '@vx/group'
import { withParentSize } from '@vx/responsive'
import { withToolTip } from '@vx/tooltip'

const ScatterPie = ({
  width,
  height,
  data,
  margin = {
    left: 50,
    top: 20,
    bottom: 50,
    right: 50,
  },
  // withToolTip
  showTooltip,
  hideTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
}) => {

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.bottom - margin.top

  if (width < 10) return null

  const kGetter = (d) => parseInt(d.fieldName)
  const vGetter = (d) => d.value

  const x = (d, i) => `Category ${i}`
  const y = (d) => vGetter(d)

  const totals = data.map(arr => arr.reduce((acc, cur) => acc + vGetter(cur), 0))

  const paddingInner = 0.1
  const paddingOuter = 0.1

  const xScale = scaleBand({
    domain: data.map(x),
    range: [0, xMax],
    paddingInner: paddingInner,
    paddingOuter: paddingOuter
  })

  // scale y axis based on total values
  const yScale = scaleLinear({
    domain: extent(totals),
    range: [yMax, 0],
    clamp: true
  })

  /** data = [
	* {'fieldname': 'statuscode1','value': total_for_status_1},
	* {'fieldname': 'statuscode2', 'value': total_for_status_2},
	*	...
	* ]
	**/
  const scatterShape = (d, i) => {

    const diameter = xScale.bandwidth()

    const leftShift = () => {
      return xScale(x(d,i)) + diameter / 2
    }

    const topShift = () => {
      // place center at total
      return yScale(totals[i])
    }

    let startAngle = 0
    let endAngle = 2 * Math.PI

    if (i === 0) {
      startAngle = Math.PI * 0.5
      endAngle = Math.PI * 1.5
    } else if (i === data.length - 1) {
      startAngle = Math.PI * 1.5
      endAngle = Math.PI * 2.5
    }

    return (
      <PieDonut
			  key={`pie-${i}`}
			  width={diameter}
			  height={diameter}
			  data={d}
			  kGetter={kGetter}
			  vGetter={vGetter}
			  xScale={xScale}
			  yScale={yScale}
			  leftShift={leftShift}
			  topShift={topShift}
			  startAngle={startAngle}
			  endAngle={endAngle}
			  hollow={false}
      />
    )
  }

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        <Group
        	left={margin.left}
        	bottom={margin.bottom}
        	top={margin.top}
        	right={margin.right}>
          <Scatter scatterShape={scatterShape} data={data}/>
          <Axes
		      showAxisX={true}
		      showAxisY={true}
		      showGrid={false}
		      xMax={xMax}
		      yMax={yMax}
		      left={{
		        top: 0,
		        left: 0,
		        scale: yScale,
		        numTicks: numTicksForHeight(height),
		        label: 'population',
		      }}
		      bottom={{
		        top: yMax,
		        left: 0,
		        scale: xScale,
		        numTicks: numTicksForWidth(width),
		        label: 'categories',
		      }}
		    />
        </Group>
      </svg>

    </React.Fragment>
  )
}

export default ScatterPie
