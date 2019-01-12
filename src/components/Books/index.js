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
    if (!this.props.data) {
      return null
    }
    const data = Object.keys(this.props.data)
      .sort((a, b) => b - a)
      .slice(0, 29)
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
        <Table celled inverted compact="very" style={{ fontSize: '11px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Count</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data
              .map((i, idx) => {
                const item = this.props.data[i]
                return (
                  <Table.Row key={i}>
                    <Table.Cell>{item[0]}</Table.Cell>
                    <Table.Cell>{item[1]}</Table.Cell>
                    <Table.Cell>
                      {Number(data[idx]).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapState = state => ({
  open: state.open,
  data: state.data[state.channels.book],
  precision: state.precision,
  channelId: state.channels.book,
})

const mapDispatch = dispatch => ({
  subscribeBooks: prec => dispatch(subscribeBooks(prec)),
  unsubscribe: channelId => dispatch(unsubscribe(channelId)),
})

export default connect(mapState, mapDispatch)(Trades)
