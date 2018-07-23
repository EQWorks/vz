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
  <div>
    <h1>VZ</h1>
    <div style={{ height: '300px' }}>
      <TimeSeries
        data={data}
        metric='impressions'
        shape='bar'
      />
    </div>
  </div>
)

export default App
