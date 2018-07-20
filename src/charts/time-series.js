import React from 'react'
import PropTypes from 'prop-types'

import { withTooltip } from '@vx/tooltip'
import { withParentSize } from '@vx/responsive'
import { localPoint } from '@vx/event'

import { PatternLines } from '@vx/pattern'
import { curveBasis, curveMonotoneX, curveStep } from '@vx/curve'
import { AreaClosed, LinePath, Bar } from '@vx/shape'
import { Group } from '@vx/group'
import { scaleUtc, scaleLinear } from '@vx/scale'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { Grid } from '@vx/grid'
import { extent, max } from 'd3-array'
import moment from 'moment'

const propTypes = {
  // withParentSize
  // withTooltip
  // TODO
  // required
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  metric: PropTypes.string.isRequired,
  // optional
  showBg: PropTypes.bool,
  showGrid: PropTypes.bool,
  margin: PropTypes.object,
  fillGap: PropTypes.bool,
  shape: PropTypes.string,
  minWidth: PropTypes.number,
}

const defaultProps = {
  showBg: false,
  showGrid: true,
  margin: {
    left: 100,
    top: 50,
    right: 100,
    bottom: 50,
  },
  fillGap: false,
  shape: 'bar',
  minWidth: 500,
}

// responsive utils for axis ticks
const numTicksForHeight = (height) => {
  if (height <= 300) {
    return 3
  }
  if (300 < height && height <= 600) {
    return 5
  }
  return 10
}

const numTicksForWidth = (width) => {
  if (width <= 300) {
    return 2
  }
  if (300 < width && width <= 400) {
    return 5
  }
  return 10
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const TimeSeries = ({
  // withTooltip
  showTooltip,
  hideTooltip,
  // required
  data,
  parentWidth: width,
  parentHeight: height,
  metric,
  // optional
  showBg,
  showGrid,
  margin,
  fillGap,
  shape,
  minWidth,
}) => {
  let tooltipTimeout

  // accessors
  const x = d => d.date
  const y = d => d[metric]

  // bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // scales
  const xScale = scaleUtc({
    rangeRound: [0, xMax],
    domain: extent(data, x),
    nice: true,
  })
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, max(data, y)],
    nice: true,
  })

  const fillZero = () => xScale.ticks().map((tick) => (
    data.find((item) => item.date.isSame(moment(tick))) || {
      date: tick,
      [metric]: 0,
    }
  ))

  // TODO: background options
  const renderBackground = () => (
    showBg && (
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
      />
    )
  )

  const getBarProps = (d, i) => {
    // TODO: responsive width
    const scaleLength = xScale.ticks().length
    const barWidth = xMax / scaleLength / scaleLength
    // x-axis value
    const xValue = xScale(x(d))
    // first data point
    if (i === 0 && y(d)) {
      return {
        width: barWidth / 2,
        xValue,
      }
    }
    // last data point
    if ((i === data.length - 1) && y(d)) {
      return {
        width: barWidth / 2,
        xValue: xValue - barWidth / 2,
      }
    }
    return {
      width: barWidth,
      xValue: xValue - barWidth / 2,
    }
  }

  const renderBar = () => (
    data.map((d, i) => {
      const barHeight = yMax - yScale(y(d))
      const { width, xValue } = getBarProps(d, i)
      return (
        <Group key={`bar-${x(d)}`}>
          <Bar
            width={width}
            height={barHeight}
            x={xValue}
            y={yMax - barHeight}
            fill='teal'
            fillOpacity={0.3}
            stroke={'teal'}
            strokeWidth={0.1}
            data={{ x: x(d), y: y(d) }}
            onMouseLeave={() => (event) => {
              tooltipTimeout = setTimeout(() => {
                hideTooltip()
              }, 300) // configurable
            }}
            onMouseMove={(data) => (event) => {
              if (tooltipTimeout) {
                clearTimeout(tooltipTimeout)
              }
              const coords = localPoint(event.target.ownerSVGElement, event)
              const tooltip = {
                tooltipLeft: coords.x,
                tooltipTop: coords.y,
                tooltipData: data,
              }
              showTooltip(tooltip)

              console.log(tooltip)
            }}
          />
        </Group>
      )
    })
  )

  const renderLine = () => (
    <LinePath
      data={fillZero()}
      xScale={xScale}
      yScale={yScale}
      x={x}
      y={y}
      stroke={'teal'}
      strokeWidth={1}
      curve={curveMonotoneX}
    />
  )

  const renderArea = () => (
    <AreaClosed
      data={fillZero()}
      xScale={xScale}
      yScale={yScale}
      x={x}
      y={y}
      fill='teal'
      fillOpacity={0.3}
      stroke={'teal'}
      strokeWidth={0.1}
      curve={curveMonotoneX}
    />
  )

  const renderShape = () => (
    {
      bar: renderBar,
      line: renderLine,
      area: renderArea,
    }[shape] || renderBar // default bar
  )()

  const renderData = () => (
    <Group top={margin.top} left={margin.left}>
      {renderShape()}
    </Group>
  )

  const renderAxes = () => (
    <Group left={margin.left}>
      <AxisLeft
        top={margin.top}
        left={0}
        scale={yScale}
        numTicks={numTicksForHeight(height)}
        label={capitalize(metric)}
      />
      <AxisBottom
        top={height - margin.top}
        left={0}
        scale={xScale}
        numTicks={numTicksForWidth(width)}
        label='Time'
      />
    </Group>
  )

  const renderGrid = () => (
    showGrid && (
      <Grid
        top={margin.top}
        left={margin.left}
        xScale={xScale}
        yScale={yScale}
        width={xMax}
        height={yMax}
        numTicksRows={numTicksForHeight(height)}
        numTicksColumns={numTicksForWidth(width)}
      />
    )
  )


  // TODO show generic "can't display"
  if (width < minWidth) {
    return (
      <svg width={width} height={height}>
        <text
          x={width / 2 - 65}
          y={height / 2 - 25}
        >
          NOT ENOUGH SPACE
        </text>
        <PatternLines
          id="lines"
          height={5}
          width={5}
          stroke={'black'}
          strokeWidth={1}
          orientation={['diagonal']}
        />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'url("#lines")'}
        />
      </svg>
    )
  }

  return (
    <svg width={width} height={height}>
      {renderBackground()}
      {renderGrid()}
      {renderData()}
      {renderAxes()}
    </svg>
  )
}

TimeSeries.propTypes = propTypes
TimeSeries.defaultProps = defaultProps

export default withParentSize(withTooltip(TimeSeries))
