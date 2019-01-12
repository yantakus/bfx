import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import websocket from '@giantmachines/redux-websocket'

import './index.css'
import App from './App'

import { reducer } from './models'

const logger = createLogger({
  collapsed: true,
})

const store = createStore(
  reducer,
  applyMiddleware(websocket, logger),
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
