import React, { Component } from 'react'
import { connect } from 'react-redux'

import { websocketConnect, websocketDisconnect, checkAlive } from './models'

import Ticker from './components/Ticker'
import Trades from './components/Trades'
import Books from './components/Books'

import './App.css'
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  componentDidMount () {
    this.connectID = setInterval(() => {
      if (this.props.open) return
      this.props.websocketConnect()
    }, 3500)

    this.aliveID = setInterval(() => {
      if (this.props.alive) {
        this.props.checkAlive()
        return
      }
      if (this.props.open) this.props.websocketDisconnect()
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.connectID)
    clearInterval(this.aliveID)
  }

  render () {
    return (
      <div className="app">
        <div className="header">
          <h3>{this.props.open ? 'Connected' : 'Disconnected'}</h3>
          <h3>{this.props.connecting && 'Connecting'}</h3>
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
          <Ticker />
        </div>

      </div>
    )
  }
}

const mapState = state => ({
  open: state.open,
  alive: state.alive,
  data: state.data,
  connecting: state.connecting,
})

const mapDispatch = dispatch => ({
  websocketConnect: () => dispatch(websocketConnect()),
  websocketDisconnect: () => dispatch(websocketDisconnect()),
  checkAlive: () => dispatch(checkAlive()),
})

export default connect(mapState, mapDispatch)(App)
