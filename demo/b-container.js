import React from 'react'

import { browserUsage } from '@vx/mock-data'

import { Breakdown } from '../src/visualizations'

const browsers = Object.keys(browserUsage[0])
  .filter(k => k !== 'date')
  .map(k => ({ label: k, usage: browserUsage[0][k] }))

class BreakdownContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shape: 'donut',
    }
  }

  handleShape = (shape) => () => {
    this.setState({ shape })
  }

  render() {
    const {
      shape,
    } = this.state

    return (
      <React.Fragment>
        <div style={{ textAlign: 'center' }}>
          <h3>Breakdown</h3>
          <div style={{ display: 'inline-block', margin: '0 1rem' }}>
            {['donut', 'pie'].map(shape => (
              <button key={shape} onClick={this.handleShape(shape)}>
                {shape}
              </button>
            ))}
          </div>
        </div>
        <Breakdown
          data={browsers}
          metrics={'usage'}
          shape={shape}
        />
      </React.Fragment>
    )
  }
}

export default BreakdownContainer
