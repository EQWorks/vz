import React from 'react'
import PropTypes from 'prop-types'
import {
  Scatter,
  Axes,
  PieDonut,
  // Markers,
} from '../parts'
import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'

import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'
import { scaleLinear, scaleBand } from '@vx/scale'
import { extent } from 'd3-array'
import { Group } from '@vx/group'
import { Arc } from '@vx/shape'
import { PatternLines } from '@vx/pattern'

const ScatterPie = ({
  // withParentSize
  parentWidth: width,
  parentHeight: height,
  // withToolTip
  showTooltip,
  hideTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  data,
  margin,
  yAxisLabel,
  xAxisLabel,
  shape,
}) => {

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.bottom - margin.top

  if (width < 10) return null

  const kGetter = (d) => parseInt(d.fieldName)
  const vGetter = (d) => d.value
  const iGetter = (d) => d[0].name

  const totals = data.map(arr => arr.reduce((acc, cur) => acc + vGetter(cur), 0))

  const paddingInner = 0.1
  const paddingOuter = 0.1

  const xScale = scaleBand({
    domain: data.map(iGetter),
    range: [0, xMax],
    paddingInner: paddingInner,
    paddingOuter: paddingOuter
  })

  const domain = extent(totals)
  const radiusInPx = xScale.bandwidth() / 2

  // get radius in base unit
  const reverseYScale = scaleLinear({
    domain: [yMax, 0],
    range: domain,
    clamp: true
  })

  const radiusInBaseUnit = reverseYScale(radiusInPx)

  // avoid overflow on y axis
  const yScale = scaleLinear({
    domain: [domain[0] - radiusInBaseUnit, domain[1] + radiusInBaseUnit],
    range: [yMax, 0],
    clamp: true,
  })

  /** data = [
  * {'fieldname': 'statuscode1','value': total_for_status_1},
  * {'fieldname': 'statuscode2', 'value': total_for_status_2},
  * ...
  * ]
  **/
  const scatterShape = (d, i) => {
    const diameter = xScale.bandwidth()

    const leftShift = () => {
      return xScale(iGetter(d)) + diameter / 2
    }

    const topShift = () => {
      // place center at total
      return yScale(totals[i])
    }

    const left = leftShift()
    const top = topShift()

    return (
      <Group key={`Pie ${i}`} top={top} left={left}>
        {tooltipOpen && tooltipData.id === i && (
          <g>
            <PatternLines
              id='lines'
              height={4}
              width={4}
              stroke='black'
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <Arc
              fill='url("#lines")'
              {...tooltipData}
            />
          </g>
        )}
        <PieDonut
          key={`pie-${i}`}
          id={i}
          width={diameter}
          height={diameter}
          data={d}
          kGetter={kGetter}
          vGetter={vGetter}
          xScale={xScale}
          yScale={yScale}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          hollow={shape === 'donut'}
        />
      </Group>
    )
  }

  const renderTooltip = () => {
    return tooltipOpen && (
      <React.Fragment key={Math.random()}>
        {tooltipData.data && (
          <TooltipWithBounds
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              color: 'teal'
            }}
          >
            {`Sub-category ${kGetter(tooltipData.data)}: ${vGetter(tooltipData.data)}`}
          </TooltipWithBounds>
        )}
      </React.Fragment>
    )
  }

  const renderAxes = () => {
    return (
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
          label: yAxisLabel,
        }}
        bottom={{
          top: yMax,
          left: 0,
          scale: xScale,
          numTicks: numTicksForWidth(width),
          label: xAxisLabel,
        }}
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
          {renderAxes()}
        </Group>
      </svg>
      {renderTooltip()}
    </React.Fragment>
  )
}

ScatterPie.propTypes = {
  // withParentSize
  parentWidth: PropTypes.number.isRequired,
  parentHeight: PropTypes.number.isRequired,
  // withTooltip
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  tooltipOpen: PropTypes.bool.isRequired,
  tooltipTop: PropTypes.number,
  tooltipLeft: PropTypes.number,
  tooltipData: PropTypes.any,
  // ScatterPie
  data: PropTypes.array.isRequired,
  margin: PropTypes.object,
  yAxisLabel: PropTypes.string.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  shape: PropTypes.string.isRequired,
}

ScatterPie.defaultProps = {
  margin: {
    left: 100,
    top: 20,
    bottom: 50,
    right: 100,
  }
}
export default withParentSize(withTooltip(ScatterPie))
