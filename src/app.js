import React from 'react'
import moment from 'moment'

import TimeSeries from './charts/time-series'
import TestTime from './charts/test-time'
import CampaignStats from './mock-data/campaign-stats'

const data = CampaignStats.filter(
  (point) => point.hour === -1
).map((point) => {
  const copy = { ...point }
  copy.date = moment.utc(point.date)
  delete copy.hour
  return copy
})

const App = () => (
  <div style={{ height: '300px' }}>
    <h1>VZ</h1>
    <TimeSeries
      data={data}
      metric='impressions'
      shape='bar'
    />
    <TestTime
      width={1024}
      height={500}
      margin={{
        left: 100,
        top: 50,
        right: 100,
        bottom: 70,
      }}
    />
  </div>
)

export default App
