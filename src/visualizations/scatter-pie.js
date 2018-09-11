import React from 'react'
import PropTypes from 'prop-types'
import {
  Scatter,
  Axes,
  PieDonut,
  NoSpace,
  HotZone,
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
import { localPoint } from '@vx/event'

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
  minWidth,
  minHeight,
  hoverable,
}) => {
  if (width < minWidth || height < minHeight) {
    return (
      <NoSpace
        width={width}
        height={height}
      />
    )
  }

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.bottom - margin.top

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
    paddingOuter: paddingOuter,
  })

  const domain = extent(totals)
  const radiusInPx = xScale.bandwidth() / 2

  // get radius in base unit
  const reverseYScale = scaleLinear({
    domain: [0, yMax],
    range: domain,
    clamp: true,
  })

  const bottom = reverseYScale(radiusInPx)
  const top = reverseYScale(radiusInPx * 2.5)
  const radiusInBaseUnit = top - bottom

  /**
   * scale for y axis
   * @type {function}
   */
  const yScale = scaleLinear({
    domain: [domain[0] - radiusInBaseUnit, domain[1] + radiusInBaseUnit],
    range: [yMax, 0],
    clamp: true,
  })

  /**
   * @function
   * get maximum radius that fits height and width
   */
  const getMaxPieRadius = () => {
    // const numPies = data.length
    const actualRadius = radiusInPx
    const maxRadiusY = Math.min(height / 2.5, actualRadius)
    // const maxRadiusX = Math.min(width / (2 * numPies), actualRadius)
    return maxRadiusY
  }

  const diameter = getMaxPieRadius() * 2
  const hollow = shape === 'donut'

  /** fn **/
  const leftShift = (d) => {
    if (data.length === 1) {
      return (width - margin.left - margin.right) / 2
    } else {
      return xScale(iGetter(d)) + diameter / 2
    }
  }

  const topShift = (i) => {
    // place center at total
    if (data.length === 1) {
      return (height - margin.top - margin.bottom) / 2
    } else {
      return yScale(totals[i])
    }
  }

  const scatterShape = (d, i) => {
    const left = leftShift(d)
    const top = topShift(i)
    const showData = data.length === 1

    return (
      <Group key={`Pie ${i}`} top={top} left={left}>
        {tooltipOpen && tooltipData.id === i && hoverable && (
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
          showData={showData}
          width={diameter}
          height={diameter}
          data={d}
          kGetter={kGetter}
          vGetter={vGetter}
          xScale={xScale}
          yScale={yScale}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          hollow={hollow}
        />
      </Group>
    )
  }

  const renderTooltipTrigger = () => {
    return data.map((d, i) => (
      <HotZone
        key={`HotZonePie-${i}`}
        shape='pie'
        vGetter={vGetter}
        left={leftShift(d)}
        top={topShift(i)}
        data={d}
        diameter={diameter}
        hollow={hollow}
        onMouseMove={(arc) => (event) => {
          const point = localPoint(event)

          showTooltip({
            tooltipData: {
              ...arc,
              // TODO: hack to resolve 0 startAngle issue
              startAngle: arc.startAngle ? arc.startAngle : 0.000000000001,

              innerRadius: hollow ? diameter / 2 - diameter / 2.74 : 0.000000000001,

              id: i,
              outerRadius: diameter / 2,
            },
            tooltipLeft: point.x,
            tooltipTop: point.y,
          })
        }}
        onMouseLeave={() => () => { hideTooltip() }}
      />
    )
    )}

  const renderTooltip = () => {
    return tooltipOpen && (
      <React.Fragment key={Math.random()}>
        {tooltipData.data && (
          <TooltipWithBounds
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              color: 'teal',
            }}
          >
            {`${kGetter(tooltipData.data)}: ${vGetter(tooltipData.data)}`}
          </TooltipWithBounds>
        )}
      </React.Fragment>
    )
  }

  const renderAxes = () => {
    const showAxisX = data.length > 1
    const showAxisY = data.length > 1
    return (
      <Axes
        showAxisX={showAxisX}
        showAxisY={showAxisY}
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
          {hoverable && renderTooltipTrigger()}
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
  yAxisLabel: PropTypes.string,
  xAxisLabel: PropTypes.string,
  shape: PropTypes.string.isRequired,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  hoverable: PropTypes.bool,
}

ScatterPie.defaultProps = {
  margin: {
    left: 0,
    top: 10,
    bottom: 45,
    right: 10,
  },
  minWidth: 100,
  minHeight: 200,
  yAxisLabel: null,
  xAxisLabel: null,
}
export default withParentSize(withTooltip(ScatterPie))
