import React from 'react'
import MultiDimData from './mock-data/multi-dim'
import { ScatterPie } from '../src/visualizations'
import _ from 'lodash'

/**
 * Configure which categories should be aggregated
 * length indicates number of pies
 * @type {Array}
 */
const categoryConfig = [
  {name: 'Age 0-5', keys: ['f3']},
  {name: 'Age 6-17', keys: ['f4']},
  {name: 'Age 18-24', keys: ['f5']},
  {name: 'Age 25-29', keys: ['f6', 'f7']},
  {name: 'Age 30-39', keys: ['f8', 'f9']},
  {name: 'Age 40-49', keys: ['f10']},
  {name: 'Age 50-59', keys: ['f11']},
  {name: 'Age 60-69', keys: ['f12', 'f13']},
  {name: 'Age 70+', keys: ['f14', 'f15', 'f16', 'f17']},
]

/**
 * The key for column containing subcategory values
 * @type {String}
 */
const subCategoryKey = 'f1'

/**
 * Data for scatter plot
 * @type {Array}
 */
const scatterData = categoryConfig.map(cg => {
  return MultiDimData.map(arr => {
    return {
      fieldName: arr[subCategoryKey],
      value: cg.keys.reduce((acc, cur) => acc + arr[cur], 0),
      name: cg.name,
    }
  })
})


class ScatterPieContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shape: 'pie',
      num: 'multi-pies',
      pie: {
        name: categoryConfig[0].name,
        data: scatterData.slice(0,1),
        total: scatterData[0].reduce((acc, { value }) => acc + value, 0),
      },
    }
  }

  handleShape = (shape) => () => {
    this.setState({ shape })
  }

  handlePieScatter = (num) => () => {
    this.setState({ num })
  }

  handlePieClick = (pieEvent) => {
    const {
      data: {
        name: categoryName,
      },
    } = pieEvent

    const idx = _.findIndex(categoryConfig, ({name}) => name === categoryName)
    const pieData = scatterData.slice(idx, idx + 1)
    const total = pieData[0].reduce((acc, { value }) => acc + value, 0)

    this.setState({
      pie: {
        data: pieData,
        name: categoryName,
        total,
      },
    })
  }

  render() {

    const {
      num,
      shape,
      pie: {
        name,
        data: pieData,
        total,
      },
    } = this.state

    const data = num === 'multi-pies' ? scatterData : scatterData.slice(0, 1)

    return(
      <React.Fragment>
        <div style={{
          width: '370px',
          borderStyle: 'solid',
          borderColor: '#C8C8C8',
        }} >
          <div style={{ textAlign: 'center' }}>
            <h3>Scatter Pie (demo card version)</h3>
          </div>
          <div>
            <div>Total Population: {total}</div>
            <div>Age Group: {name}</div>
          </div>
          <div style={{height: '400px'}}>
            <ScatterPie
              data={pieData}
              shape={shape}
              hoverable={true}
              margin={{
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{ display: 'inline-block', margin: '0 1rem' }}>
              {['donut', 'pie'].map(shape => (
                <button key={shape} onClick={this.handleShape(shape)}>
                  {shape}
                </button>
              ))}
            </div>
            <div style={{ display: 'inline-block', margin: '0 1rem' }}>
              {['single-pie', 'multi-pies'].map(num => (
                <button key={num} onClick={this.handlePieScatter(num)}>
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginTop: '10px'}}>population distribution of age groups</div>
          <div style={{height: '450px'}}>
            <ScatterPie
              data={data}
              shape={shape}
              xAxisLabel='Age Groups'
              xAxisTick={true}
              hoverable={false}
              onPieClick={this.handlePieClick}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ScatterPieContainer
