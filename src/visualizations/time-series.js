import React from 'react'
import PropTypes from 'prop-types'

import { withTooltip } from '@vx/tooltip'
import { withParentSize } from '@vx/responsive'

import { Group } from '@vx/group'
import { scaleUtc, scaleLinear } from '@vx/scale'
import { extent, max } from 'd3-array'
import { utcDay, utcHour, utcMinute } from 'd3-time'
import moment from 'moment'

import NoSpace from '../parts/no-space'
import Background from '../parts/background'
import Axes from '../parts/axes'
import Bars from '../parts/bars'
import LineArea from '../parts/line-area'

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
  const today = moment.utc().startOf('day')

  // accessors
  const x = d => d.date
  const y = d => (d[metrics] || 0)
  const color = d => d && moment(x(d)).startOf('day').isSame(today) ? 'Teal' : 'LightSkyBlue'

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
      <Background
        width={width}
        height={height}
      />
    )
  )

  const renderBars = () => (
    <Bars
      xMax={xMax}
      yMax={yMax}
      barWidth={xMax / (xRange.length || 1) - 5}
      data={data}
      xGetter={x}
      yGetter={y}
      xScale={xScale}
      yScale={yScale}
      color={color}
    />
  )

  const renderLineArea = (shape) => (
    <LineArea
      showArea={shape === 'area'}
      data={fillZero()}
      xGetter={x}
      yGetter={y}
      xScale={xScale}
      yScale={yScale}
      color={color}
    />
  )

  const renderShape = () => {
    if (shape === 'bar') {
      return renderBars()
    }
    return renderLineArea(shape)
  }

  const renderData = () => (
    <Group top={margin.top} left={margin.left}>
      {renderShape()}
    </Group>
  )

  const renderAxes = () => (
    <Group left={margin.left} top={margin.top}>
      <Axes
        showGrid={showGrid}
        xMax={xMax}
        yMax={yMax}
        left={{
          top: 0,
          left: 0,
          scale: yScale,
          numTicks: numTicksForHeight(height),
          label: capitalize(metrics)
        }}
        bottom={{
          top: height - margin.top * 2,
          left: 0,
          scale: xScale,
          numTicks: numTicksForWidth(width),
          label: 'Time'
        }}
      />
    </Group>
  )

  if (width < minWidth) {
    return (
      <NoSpace
        width={width}
        height={height}
      />
    )
  }

  return (
    <svg width={width} height={height}>
      {renderBackground()}
      {renderAxes()}
      {renderData()}
    </svg>
  )
}

TimeSeries.propTypes = {
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

TimeSeries.defaultProps = {
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
  minWidth: 600,
  interval: 'daily'
}

export default withParentSize(withTooltip(TimeSeries))
