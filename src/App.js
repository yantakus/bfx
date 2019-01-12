import React, { Component } from 'react'
import { connect } from 'react-redux'

import { websocketConnect, websocketDisconnect } from './models'

import Trades from './components/Trades'
import Books from './components/Books'

import './App.css'
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  render () {
    return (
      <div className="app">
        <div className="header">
          <h3>{this.props.open ? 'Connected' : 'Disconnected'}</h3>
          <button onClick={() => {
            if (this.props.open) {
              this.props.websocketDisconnect()
            } else {
              this.props.websocketConnect()
            }
          }}>{this.props.open ? 'Disconnect' : 'Connect'}</button>
        </div>
        <div className="columns">
          <Trades />
          <Books />
        </div>

      </div>
    )
  }
}

const mapState = state => ({
  open: state.open,
  data: state.data,
})

const mapDispatch = dispatch => ({
  websocketConnect: () => dispatch(websocketConnect()),
  websocketDisconnect: () => dispatch(websocketDisconnect()),
})

export default connect(mapState, mapDispatch)(App)
