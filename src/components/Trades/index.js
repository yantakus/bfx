import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Icon } from 'semantic-ui-react'

import { subscribeTrades } from '../../models'

class Trades extends Component {
  componentDidMount () {
    if (this.props.open) {
      this.props.subscribeTrades()
    }
  }
  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.props.subscribeTrades()
    }
  }
  render () {
    if (!this.props.data) {
      return null
    }
    return (
      <div>
        <h4>Trades</h4>
        <Table celled inverted compact="very" style={{ fontSize: '11px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.data.map(i => {
              const amount = i[2].toFixed(4)
              const negative = amount < 0
              return (
                <Table.Row key={i[0]}>
                  <Table.Cell>
                    <Icon
                      name={negative ? 'chevron down' : 'chevron up'}
                      color={negative ? 'red' : 'green'}
                    />
                  </Table.Cell>
                  <Table.Cell>{String(new Date(i[1])).substr(16, 8)}
                  </Table.Cell>
                  <Table.Cell>{i[3].toFixed(1)}</Table.Cell>
                  <Table.Cell>{Math.abs(amount)}</Table.Cell>
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
  data: state.data[state.channels.trades],
})

const mapDispatch = dispatch => ({
  subscribeTrades: () => dispatch(subscribeTrades()),
})

export default connect(mapState, mapDispatch)(Trades)
