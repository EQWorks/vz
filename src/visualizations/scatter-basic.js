import React from 'react'
import PropTypes from 'prop-types'
import {
  Scatter,
  Axes,
  // PieDonut,
  Markers,
  HotZone,
} from '../parts'

import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'

import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'
import { scaleLinear, scaleBand } from '@vx/scale'
import { extent } from 'd3-array'
import { Group } from '@vx/group'
// import { GlyphDot } from '@vx/glyph'
import { localPoint } from '@vx/event'

const ScatterBasic = ({
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
  // own props
  data,
  margin,
  yAxisLabel,
  xAxisLabel,
  drawAScatter,
}) => {

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.bottom - margin.top

  const kGetter = (obj) => obj.fieldName
  const vGetter = (obj) => obj.value

  const xScale = scaleBand({
    domain: data.map(kGetter),
    range: [0, xMax],
    clamp: true,
  })

  const yScale = scaleLinear({
    domain: extent(data, vGetter),
    range: [yMax, 0],
    clamp: true,
  })

  const renderAxes = () => {
    return (
      <Axes
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

  // eslint-disable-next-line
  const scatterShape = (d, _) => {
    const bw = xScale.bandwidth() / 2
    const left = xScale(kGetter(d)) + bw
    const top = yScale(vGetter(d))

    return drawAScatter(left, top)
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

  const renderToolTip = () => (
    tooltipOpen && tooltipData && (
      <TooltipWithBounds
        left={tooltipLeft}
        top={margin.top}>
        {kGetter(tooltipData)}: {vGetter(tooltipData)}
      </TooltipWithBounds>
    ))

  const handleTooltip = ({ data, event }) => {
    const point = localPoint(event)
    const step = xScale.step()
    const index = Math.round((point.x - margin.left) / step)

    if (index < data.length && index >= 0) {
      const pointData = data[index]
      const bw = xScale.bandwidth() / 2
      const tip = {
        tooltipData: pointData,
        tooltipLeft: xScale(kGetter(pointData)) + bw,
        tooltipTop: yScale(vGetter(pointData)),
      }
      showTooltip(tip)
    }
  }

  const renderTooltipTrigger = () => (
    <HotZone
      width={xMax}
      height={yMax}
      data={data}
      onMouseMove={(data) => (event) => handleTooltip({ data, event })}
      onMouseLeave={() => () => { hideTooltip() }}
    />
  )

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        <Group
          left={margin.left}
          bottom={margin.bottom}
          top={margin.top}
          right={margin.right}>
          {renderMarkers()}
          {renderAxes()}
          {renderTooltipTrigger()}
          <Scatter scatterShape={scatterShape} data={data}/>
        </Group>
      </svg>
      {renderToolTip()}
    </React.Fragment>
  )
}

ScatterBasic.propTypes = {
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
  drawAScatter: PropTypes.func.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  // optional
  margin: PropTypes.object,
}

ScatterBasic.defaultProps = {
  margin: {
    left: 100,
    top: 20,
    bottom: 50,
    right: 100,
  },
}

export default withParentSize(withTooltip(ScatterBasic))
