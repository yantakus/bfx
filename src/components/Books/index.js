import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Dropdown } from 'semantic-ui-react'

import countTotal from '../../util/count-total'
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

class Books extends Component {
  componentDidMount () {
    if (this.props.open) {
      this.props.subscribeBooks()
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
        <div style={{ display: 'flex', backgroundColor: '#333' }}>
          <div style={{ position: 'relative' }}>
            <svg key="bids" style={{
              position: 'absolute',
              top: 40,
              left: 0,
              width: '100%',
              height: '699px',
              transform: 'scale(-1, 1)',
              pointerEvents: 'none',
            }}>
              {bids.map(([key, val], idx) => {
                const total = countTotal(bids, bids.length)
                const cur = countTotal(bids, idx)
                const percent = cur / total * 100
                return (
                  <rect
                    key={key}
                    x="0"
                    y={idx === 0 ? 0 : idx * 28}
                    width={`${percent}%`}
                    height="27"
                    fill="#89bc3e"
                    fillOpacity="0.2"
                  />
                )
              })}
            </svg>
            <Table inverted compact="very" singleLine style={{
              fontSize: '11px',
              borderRight: '1px solid black',
              backgroundColor: 'transparent',
              margin: 0,
            }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Count</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body style={{ position: 'relative' }}>
                {bids.map(([key, val], idx) => {
                  return (
                    <Table.Row key={key}>
                      <Table.Cell>{val[0]}</Table.Cell>
                      <Table.Cell>{val[1].toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        {countTotal(bids, idx)}
                      </Table.Cell>
                      <Table.Cell>
                        {key.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>

          <div style={{ position: 'relative' }}>
            <svg key="asks" style={{
              position: 'absolute',
              top: 40,
              left: 0,
              width: '100%',
              height: '699px',
              transform: 'scale(1, 1)',
              pointerEvents: 'none',
            }}>
              {asks.map(([key, val], idx) => {
                const total = countTotal(asks, asks.length)
                const cur = countTotal(asks, idx)
                const percent = cur / total * 100
                return (
                  <rect
                    key={key}
                    x="0"
                    y={idx === 0 ? 0 : idx * 28}
                    width={`${percent}%`}
                    height="27"
                    fill="#d8464e"
                    fillOpacity="0.2"
                  />
                )
              })}
            </svg>
            <Table
              inverted
              compact="very"
              style={{
                fontSize: '11px',
                margin: 0,
                backgroundColor: 'transparent',
              }}>
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
                        {countTotal(asks, idx)}
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

export default connect(mapState, mapDispatch)(Books)
