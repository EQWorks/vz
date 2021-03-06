import React from 'react'
import PropTypes from 'prop-types'

import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import { Group } from '@vx/group'
import { scaleUtc, scaleLinear } from '@vx/scale'
import { extent, max, bisector } from 'd3-array'
import { utcDay, utcHour, utcMinute } from 'd3-time'
import moment from 'moment'

import {
  NoSpace,
  Axes,
  Markers,
  HotZone,
  Bars,
  LineArea,
} from '../parts'
import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'

const getTimeRange = (start, end, interval) => ([...({
  daily: utcDay,
  hourly: utcHour,
  minutely: utcMinute,
}[interval] || utcDay).range(start, end), end])

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

const TimeSeries = ({
  // withParentSize
  parentWidth: width,
  parentHeight: height,
  // withTooltip
  showTooltip,
  hideTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  // required
  data,
  metrics,
  // optional
  showAxisX,
  showAxisY,
  showGrid,
  margin,
  snapTooltip,
  shape,
  minWidth,
  interval,
}) => {
  if (width < minWidth) {
    return (
      <NoSpace
        width={width}
        height={height}
      />
    )
  }

  const fillZero = () => xRange.map(date => (
    data.find(item => item.date.isSame(moment(date))) || {
      date,
      [metrics]: 0,
    }
  ))

  const today = moment.utc().startOf('day')

  // accessors
  const xGetter = (d) => d.date
  const yGetter = (d) => (d[metrics] || 0)
  const bisectDate = bisector(xGetter).left
  const color = (d) => (d && moment(xGetter(d)).startOf('day').isSame(today) ? 'Teal' : 'LightSkyBlue')

  // bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // scales
  const xDomain = extent(data, xGetter)
  const xRange = getTimeRange(xDomain[0], xDomain[1], interval)
  const xScale = scaleUtc({
    rangeRound: [0, xMax],
    domain: xDomain,
    // nice: true,
  })
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, max(data, yGetter)],
    nice: true,
  })

  const renderBars = () => (
    <Bars
      xMax={xMax}
      yMax={yMax}
      barWidth={xMax / (xRange.length || 1) - 5}
      data={data}
      xGetter={xGetter}
      yGetter={yGetter}
      xScale={xScale}
      yScale={yScale}
      colorFunc={color}
    />
  )

  const renderLineArea = () => (
    <LineArea
      showArea={shape === 'area'}
      data={fillZero()}
      xGetter={xGetter}
      yGetter={yGetter}
      xScale={xScale}
      yScale={yScale}
      colorFunc={color}
    />
  )

  const renderShape = () => {
    if (shape === 'bar') {
      return renderBars()
    }
    return renderLineArea()
  }

  const renderAxes = () => (
    <Axes
      showAxisX={showAxisX}
      showAxisY={showAxisY}
      showGrid={showGrid}
      xMax={xMax}
      yMax={yMax}
      left={{
        top: 0,
        left: 0,
        scale: yScale,
        numTicks: numTicksForHeight(height),
        label: capitalize(metrics),
      }}
      bottom={{
        top: height - margin.top * 2,
        left: 0,
        scale: xScale,
        numTicks: numTicksForWidth(width),
        label: 'Time',
      }}
    />
  )

  const handleTooltip = ({ data, event }) => {
    const point = localPoint(event)
    const xDomain = xScale.invert(point.x - margin.left)
    const index = bisectDate(data, xDomain, 1)
    const dLeft = data[index - 1]
    const dRight = data[index]
    let d = dLeft
    if (dRight && dRight.date) {
      d = xDomain - (new Date(dLeft.date)) > (new Date(dRight.date)) - xDomain ? dRight : dLeft
    }
    const tip = {
      tooltipData: d,
      tooltipLeft: xScale(d.date),
      tooltipTop: yScale(d[metrics]),
    }
    if (!snapTooltip) {
      Object.assign(tip, {
        tooltipLeft: point.x - margin.left,
        tooltipTop: point.y - margin.top,
      })
    }
    showTooltip(tip)
  }

  const renderTooltipTrigger = () => (
    <HotZone
      width={xMax}
      height={yMax}
      data={fillZero()}
      onMouseMove={(data) => (event) => handleTooltip({ data, event })}
      onMouseLeave={() => () => { hideTooltip() }}
    />
  )

  const renderTooltip = () => {
    let timeFormat = 'ddd, LL'
    if (interval !== 'daily') {
      timeFormat += ' LT'
    }
    return tooltipOpen && (
      <React.Fragment key={Math.random()}>
        <TooltipWithBounds
          top={yMax + margin.top}
          left={tooltipLeft + margin.left}
        >
          {moment.utc(tooltipData.date).format(timeFormat)}
          {tooltipData[metrics] === 0 && (
            <span style={{ color: color(tooltipData) }}>
              {`: ${tooltipData[metrics]}`}
            </span>
          )}
        </TooltipWithBounds>
        {tooltipData[metrics] > 0 && (
          <TooltipWithBounds
            top={tooltipTop}
            left={tooltipLeft + margin.left}
            style={{
              color: color(tooltipData),
            }}
          >
            {tooltipData[metrics]}
          </TooltipWithBounds>
        )}
      </React.Fragment>
    )
  }

  const renderMarkers = () => (
    tooltipOpen && (
      <Markers
        x={tooltipLeft}
        y={tooltipTop}
        xMax={xMax}
        yMax={yMax}
      />
    )
  )

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {renderMarkers()}
          {renderAxes()}
          {renderShape()}
          {renderTooltipTrigger()}
        </Group>
      </svg>
      {renderTooltip()}
    </React.Fragment>
  )
}

TimeSeries.propTypes = {
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
  // required
  data: PropTypes.array.isRequired,
  metrics: PropTypes.string.isRequired,
  // optional
  showAxisX: PropTypes.bool,
  showAxisY: PropTypes.bool,
  showGrid: PropTypes.bool,
  margin: PropTypes.object,
  snapTooltip: PropTypes.bool,
  shape: PropTypes.string,
  minWidth: PropTypes.number,
  interval: PropTypes.string,
}

TimeSeries.defaultProps = {
  showAxisX: true,
  showAxisY: true,
  showGrid: true,
  margin: {
    left: 100,
    top: 50,
    right: 100,
    bottom: 50,
  },
  snapTooltip: true,
  shape: 'bar',
  minWidth: 600,
  interval: 'daily',
}

export default withParentSize(withTooltip(TimeSeries))
