import React from 'react'
import moment from 'moment'

import TimeSeries from './charts/time-series'
import CampaignStats from './mock-data/campaign-stats'

const dailyData = CampaignStats.filter(
  (point) => point.hour === -1
).map((point) => {
  const copy = { ...point }
  copy.date = moment.utc(point.date)
  delete copy.hour
  return copy
})

const hourlyData = CampaignStats.filter(
  (point) => point.hour !== -1
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
      interval: 'daily'
    }
  }

  onClick = (interval) => () => {
    this.setState({ interval })
  }

  render() {
    const { interval } = this.state

    return (
      <div>
        <button onClick={this.onClick('daily')}>daily</button>
        <button onClick={this.onClick('hourly')}>hourly</button>
        <div style={{ height: '255px' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics='impressions'
            shape='bar'
            interval={interval}
          />
        </div>
        <div style={{ height: '255px' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics='impressions'
            shape='area'
            interval={interval}
          />
        </div>
        <div style={{ height: '255px' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics='impressions'
            shape='line'
            interval={interval}
          />
        </div>
      </div>
    )
  }
}

export default TimeSeriesContainer
