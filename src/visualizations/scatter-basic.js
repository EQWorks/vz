import React from 'react'
import PropTypes from 'prop-types'
import {
  Scatter,
  Axes,
  PieDonut,
  Markers,
  HotZone,
} from '../parts'

import { withParentSize } from '@vx/responsive'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip'

import { numTicksForHeight, numTicksForWidth } from '../utils/responsive'
import { scaleLinear, scaleBand } from '@vx/scale'
import { extent } from 'd3-array'
import { Group } from '@vx/group'
import { GlyphDot } from '@vx/glyph'

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
    clamp: true
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

  const scatterShape = (d, i) => {
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

  const renderTooltip = () => {
    console.log('123')
    console.log(tooltipData)
  }

  const renderToolTipTrigger = () => {
    console.log('Tool tip render clicked!')
    showTooltip()
  }

  return (
     <svg width={width} height={height}>
      <Group
        left={margin.left}
        bottom={margin.bottom}
        top={margin.top}
        right={margin.right}>
        <Scatter scatterShape={scatterShape} data={data}/>
        {renderMarkers()}
        {renderAxes()}
      </Group>
    </svg>
  )
}


ScatterBasic.defaultProps = {
  margin: {
    left: 100,
    top: 20,
    bottom: 50,
    right: 100,
  }
}

export default withParentSize(withTooltip(ScatterBasic))
