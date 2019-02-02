import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'

import { subscribeTicker } from '../../models'

class Ticker extends Component {
  componentDidMount () {
    if (this.props.open) {
      this.props.subscribeTicker()
    }
  }
  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.props.subscribeTicker()
    }
  }
  render () {
    if (!this.props.data) {
      return null
    }
    const { data } = this.props
    const dailyChange = data[4]
    return (
      <div style={{ width: '400px' }}>
        <h4>Ticker</h4>
        <Table celled inverted compact="very" style={{ fontSize: '11px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Daily change</Table.HeaderCell>
              <Table.HeaderCell>Vol BTC</Table.HeaderCell>
              <Table.HeaderCell>Vol USD</Table.HeaderCell>
              <Table.HeaderCell>High</Table.HeaderCell>
              <Table.HeaderCell>Low</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell><Icon name="bitcoin" size="big" /></Table.Cell>
              <Table.Cell>
                {data[6].toLocaleString(undefined, { minimumFractionDigits: 1 })}</Table.Cell>
              <Table.Cell
                style={{ color: dailyChange < 0 ? 'red' : 'green' }}
              >{Math.abs(dailyChange)} {`(${(Math.abs(data[5]) * 100).toFixed(2)}%)`}</Table.Cell>
              <Table.Cell>{Math.round(data[7]).toLocaleString()}</Table.Cell>
              <Table.Cell>{Math.round(data[7] * data[6]).toLocaleString()}</Table.Cell>
              <Table.Cell>{data[8]}</Table.Cell>
              <Table.Cell>{data[9]}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapState = state => ({
  open: state.open,
  data: state.data[state.channels.ticker],
})

const mapDispatch = dispatch => ({
  subscribeTicker: () => dispatch(subscribeTicker()),
})

export default connect(mapState, mapDispatch)(Ticker)
