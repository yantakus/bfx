import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Dropdown } from 'semantic-ui-react'

import { subscribeBooks, unsubscribe } from '../../models'

const precisionOptions = [
  {
    text: 'P0',
    value: 'P0',
  },
  {
    text: 'P1',
    value: 'P1',
  },
  {
    text: 'P2',
    value: 'P2',
  },
  {
    text: 'P3',
    value: 'P3',
  },
]

class Trades extends Component {
  componentDidMount () {
    if (this.props.open) {
      this.props.subscribBooks()
    }
  }
  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.props.subscribeBooks()
    }
  }
  changePrecision (value) {
    if (value !== this.props.precision) {
      this.props.subscribeBooks(value)
      this.props.unsubscribe(this.props.channelId)
    }
  }
  render () {
    if (!this.props.bids || !this.props.asks) {
      return null
    }
    const bids = [...this.props.bids].sort((a, b) => b[0] - a[0])
    const asks = [...this.props.asks].sort((a, b) => a[0] - b[0])
    return (
      <div>
        <h4>Books</h4>
        <Dropdown
          placeholder="Select precision"
          selection
          options={precisionOptions}
          value={this.props.precision}
          onChange={(e, data) => this.changePrecision(data.value) }
        />
        <div style={{ display: 'flex' }}>
          <Table celled inverted compact="very" style={{ fontSize: '11px', borderRight: '1px solid black' }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Count</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {bids.map(([key, val], idx) => {
                return (
                  <Table.Row key={key}>
                    <Table.Cell>{val[0]}</Table.Cell>
                    <Table.Cell>{val[1].toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      {bids.reduce((acc, cur, curIdx) => {
                        if (idx >= curIdx) {
                          return acc + cur[1][1]
                        }
                        return acc
                      }, 0).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      {key.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>

          <Table celled inverted compact="very" style={{ fontSize: '11px', marginTop: 0 }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {asks.map(([key, val], idx) => {
                return (
                  <Table.Row key={key}>
                    <Table.Cell>
                      {key.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </Table.Cell>
                    <Table.Cell>
                      {asks.reduce((acc, cur, curIdx) => {
                        if (idx >= curIdx) {
                          return acc + Math.abs(cur[1][1])
                        }
                        return acc
                      }, 0).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>{Math.abs(val[1]).toFixed(2)}</Table.Cell>
                    <Table.Cell>{val[0]}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  const channel = state.data[state.channels.book]
  return {
    open: state.open,
    bids: channel && channel.bids,
    asks: channel && channel.asks,
    precision: state.precision,
    channelId: state.channels.book,
  }
}

const mapDispatch = dispatch => ({
  subscribeBooks: prec => dispatch(subscribeBooks(prec)),
  unsubscribe: channelId => dispatch(unsubscribe(channelId)),
})

export default connect(mapState, mapDispatch)(Trades)
