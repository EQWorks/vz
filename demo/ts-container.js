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
      toggles: {
        snapTooltip: true,
        showAxisX: true,
        showAxisY: true,
        showGrid: true,
      },
    }
  }

  handleInterval = (interval) => () => {
    this.setState({ interval })
  }

  handleShape = (shape) => () => {
    this.setState({ shape })
  }

  handleToggle = (toggle) => () => {
    const toggles = { ...this.state.toggles, [toggle]: !this.state.toggles[toggle] }
    this.setState({ toggles })
  }

  render() {
    const {
      interval,
      shape,
      toggles,
    } = this.state

    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <h3>Time Series</h3>
          <div style={{ display: 'inline-block', margin: '0 1rem' }}>
            {['daily', 'hourly'].map(interval => (
              <button key={interval} onClick={this.handleInterval(interval)}>
                {interval}
              </button>
            ))}
          </div>
          <div style={{ display: 'inline-block', margin: '0 1rem' }}>
            {['bar', 'area', 'line'].map(shape => (
              <button key={shape} onClick={this.handleShape(shape)}>
                {shape}
              </button>
            ))}
          </div>
          <div style={{ display: 'inline-block', margin: '0 1rem' }}>
            {Object.keys(toggles).map(toggle => (
              <button key={toggle} onClick={this.handleToggle(toggle)}>
                {toggle}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '345', clear: 'both' }}>
          <TimeSeries
            data={interval === 'daily' ? dailyData : hourlyData}
            metrics="impressions"
            shape={shape}
            interval={interval}
            {...toggles}
          />
        </div>
      </div>
    )
  }
}

export default TimeSeriesContainer
