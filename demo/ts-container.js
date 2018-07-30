import React from 'react'
import moment from 'moment'

import TimeSeries from '../src/visualizations/time-series'
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
    }
  }

  handleInterval = interval => () => {
    this.setState({ interval })
  }

  handleShape = shape => () => {
    this.setState({ shape })
  }

  render() {
    const {
      interval,
      shape,
    } = this.state

    return (
      <div>
        <div style={{ float: 'left' }}>
          {['daily', 'hourly'].map(interval => (
            <button key={interval} onClick={this.handleInterval(interval)}>
              {interval}
            </button>
          ))}
        </div>
        <div style={{ float: 'right' }}>
          {['bar', 'area', 'line'].map(shape => (
            <button key={shape} onClick={this.handleShape(shape)}>
              {shape}
            </button>
          ))}
        </div>
        <div style={{ height: '345', clear: 'both' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics="impressions"
            shape={shape}
            interval={interval}
          />
        </div>
      </div>
    )
  }
}

export default TimeSeriesContainer
