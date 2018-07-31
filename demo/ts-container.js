import React from 'react'
import moment from 'moment'

import { TimeSeries } from '../src/visualizations'
import CampaignStats from './mock-data/campaign-stats'

const dailyData = CampaignStats.filter(
  point => point.hour === -1
).map((point) => {
  const copy = { ...point }
  copy.date = moment.utc(point.date)
  delete copy.hour
  return copy
})

const hourlyData = CampaignStats.filter(
  point => point.hour !== -1
).map((point) => {
  const copy = { ...point }
  copy.date = moment.utc(`${point.date}T${String(point.hour).padStart(2, '0')}:00:00`)
  delete copy.hour
  return copy
})

class TimeSeriesContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      interval: 'daily',
      shape: 'bar',
      snapTooltip: true,
    }
  }

  handleInterval = (interval) => () => {
    this.setState({ interval })
  }

  handleShape = (shape) => () => {
    this.setState({ shape })
  }

  toggleSnapTooltip = (snapTooltip) => () => {
    this.setState({ snapTooltip: !snapTooltip })
  }

  render() {
    const {
      interval,
      shape,
      snapTooltip,
    } = this.state

    return (
      <div>
        <div>
          {['daily', 'hourly'].map(interval => (
            <button key={interval} onClick={this.handleInterval(interval)}>
              {interval}
            </button>
          ))}
        </div>
        <div>
          {['bar', 'area', 'line'].map(shape => (
            <button key={shape} onClick={this.handleShape(shape)}>
              {shape}
            </button>
          ))}
        </div>
        <div>
          <button onClick={this.toggleSnapTooltip(snapTooltip)}>
            tooltip {snapTooltip ? 'snapping ' : 'loose'}
          </button>
        </div>
        <div style={{ height: '345', clear: 'both' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics="impressions"
            shape={shape}
            interval={interval}
            snapTooltip={snapTooltip}
          />
        </div>
      </div>
    )
  }
}

export default TimeSeriesContainer
