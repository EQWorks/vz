import React from 'react'

import { browserUsage } from '@vx/mock-data'

import { Breakdown } from '../src/visualizations'

const browsers = Object.keys(browserUsage[0])
  .filter(k => k !== 'date')
  .map(k => ({ label: k, usage: browserUsage[0][k] }))

class BreakdownContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ textAlign: 'center' }}>
          <h3>Breakdown</h3>
        </div>
        <Breakdown
          data={browsers}
          metrics={'usage'}
        />
      </React.Fragment>
    )
  }
}

export default BreakdownContainer
