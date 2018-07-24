import React from 'react'
import PropTypes from 'prop-types'

import { withTooltip } from '@vx/tooltip'
import { withParentSize } from '@vx/responsive'
import { localPoint } from '@vx/event'

import { PatternLines } from '@vx/pattern'
import { curveMonotoneX } from '@vx/curve'
import { AreaClosed, LinePath, Bar } from '@vx/shape'
import { GlyphDot } from '@vx/glyph'
import { Group } from '@vx/group'
import { scaleUtc, scaleLinear } from '@vx/scale'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { Grid } from '@vx/grid'
import { extent, max } from 'd3-array'
import { utcDay, utcHour, utcMinute } from 'd3-time'
import moment from 'moment'

const propTypes = {
  // withParentSize
  parentWidth: PropTypes.number.isRequired,
  parentHeight: PropTypes.number.isRequired,
  // withTooltip
  // showTooltip: PropTypes.func.isRequired,
  // hideTooltip: ,
  // tooltipOpen: ,
  // tooltipLeft: ,
  // tooltipTop: ,
  // tooltipData: ,
  // required
  data: PropTypes.array.isRequired,
  // width: PropTypes.number.isRequired,
  // height: PropTypes.number.isRequired,
  metrics: PropTypes.string.isRequired,
  // optional
  showBg: PropTypes.bool,
  showGrid: PropTypes.bool,
  margin: PropTypes.object,
  // fillGap: PropTypes.bool,
  shape: PropTypes.string,
  minWidth: PropTypes.number,
  interval: PropTypes.string
}

const defaultProps = {
  showBg: false,
  showGrid: true,
  margin: {
    left: 100,
    top: 50,
    right: 100,
    bottom: 50
  },
  // fillGap: false,
  shape: 'bar',
  minWidth: 500,
  interval: 'daily'
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

const getTimeRange = (start, end, interval) => ([...({
  daily: utcDay,
  hourly: utcHour,
  minutely: utcMinute
}[interval] || utcDay).range(start, end), end])

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const TimeSeries = ({
  // withParentSize
  parentWidth: width,
  parentHeight: height,
  // withTooltip
  // showTooltip,
  // hideTooltip,
  // tooltipOpen,
  // tooltipLeft,
  // tooltipTop,
  // tooltipData,
  // required
  data,
  metrics,
  // optional
  showBg,
  showGrid,
  margin,
  // fillGap,
  shape,
  minWidth,
  interval
}) => {
  let tooltipTimeout

  const today = moment.utc().startOf('day')

  // accessors
  const x = d => d.date
  const y = d => (d[metrics] || 0)
  const color = d => moment(x(d)).startOf('day').isSame(today) ? 'Teal' : 'LightSkyBlue'

  // bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // scales
  const xDomain = extent(data, x)
  const xRange = getTimeRange(xDomain[0], xDomain[1], interval)
  const xScale = scaleUtc({
    rangeRound: [0, xMax],
    domain: xDomain
    // nice: true,
  })
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, max(data, y)],
    nice: true
  })

  const fillZero = () => xRange.map((date) => (
    data.find((item) => item.date.isSame(moment(date))) || {
      date,
      [metrics]: 0
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
    // responsive bar width
    const width = Math.max(xMax / (xRange.length || 1) - 5, 2)
    // x-axis value
    let xValue = xScale(x(d))
    // first data point
    if (xValue === 0) {
      return {
        width: Math.max(width / 2, 2),
        xValue
      }
    }
    // "center" bar on x-tick
    xValue = xValue - width / 2
    // last data point
    if ((i === data.length - 1) && y(d)) {
      return {
        width: Math.max(width / 2, 2),
        xValue
      }
    }
    return { width, xValue }
  }

  const renderBar = () => {
    return data.map((d, i) => {
      const barHeight = yMax - yScale(y(d))
      const { width, xValue } = getBarProps(d, i)
      return (
        <Group key={`bar-${x(d)}`}>
          <Bar
            width={width}
            height={barHeight}
            x={xValue}
            y={yMax - barHeight}
            fill={color(d)}
            fillOpacity={0.3}
            stroke={color(d)}
            strokeWidth={0.7}
            data={{ x: x(d), y: y(d) }}
            onMouseLeave={() => () => {
              tooltipTimeout = setTimeout(() => {
                // hideTooltip()
                console.log('hide tooltip')
              }, 300) // TODO: configurable
            }}
            onMouseMove={(data) => (event) => {
              if (tooltipTimeout) {
                clearTimeout(tooltipTimeout)
              }
              const coords = localPoint(event.target.ownerSVGElement, event)
              const tooltip = {
                tooltipLeft: coords.x,
                tooltipTop: coords.y,
                tooltipData: data
              }
              // showTooltip(tooltip)

              console.log(tooltip)
            }}
          />
        </Group>
      )
    })
  }

  const renderLine = () => (
    <LinePath
      data={fillZero()}
      xScale={xScale}
      yScale={yScale}
      x={x}
      y={y}
      stroke='LightSkyBlue'
      strokeWidth={1}
      curve={curveMonotoneX}
      glyph={(d,i) => {
        return (
          <g key={`line-point-${i}`}>
            <GlyphDot
              cx={xScale(x(d))}
              cy={yScale(y(d))}
              r={y(d) ? 3 : 1}
              fill={color(d)}
              fillOpacity={y(d) ? 0.7 : 0.3}
            />
          </g>
        )
      }}
    />
  )

  const renderArea = () => (
    <Group>
      {renderLine()}
      <AreaClosed
        data={fillZero()}
        xScale={xScale}
        yScale={yScale}
        x={x}
        y={y}
        fill='LightSkyBlue'
        fillOpacity={0.3}
        stroke='transparent'
        strokeWidth={0}
        curve={curveMonotoneX}
      />
    </Group>
  )

  const renderShape = () => (
    {
      bar: renderBar,
      line: renderLine,
      area: renderArea
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
        label={capitalize(metrics)}
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

  // const renderTooltip = () => (
  //   tooltipOpen && (
  //     <Tooltip left={tooltipLeft} top={tooltipTop}>
  //       <div>
  //         <strong>x:</strong> {tooltipData[0]}
  //       </div>
  //       <div>
  //         <strong>y:</strong> {tooltipData[1]}
  //       </div>
  //     </Tooltip>
  //   )
  // )

  // TODO: better calculation to center text
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
