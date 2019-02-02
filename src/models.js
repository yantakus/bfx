import arrayToMap from './util/array-to-map'
import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_SEND,
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSED,
} from '@giantmachines/redux-websocket'

const CHECK_ALIVE = 'CHECK_ALIVE'

// Actions
export const websocketConnect = () => ({
  type: WEBSOCKET_CONNECT,
  payload: {
    url: 'wss://api.bitfinex.com/ws/2',
  },
})

export const websocketDisconnect = () => ({
  type: WEBSOCKET_DISCONNECT,
})

export const subscribeTrades = () => {
  return {
    type: WEBSOCKET_SEND,
    payload: {
      event: 'subscribe',
      channel: 'trades',
      symbol: 'tBTCUSD',
    },
  }
}

export const subscribeBooks = (prec = 'P0') => {
  return {
    type: WEBSOCKET_SEND,
    payload: {
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD',
      freq: 'F1',
      prec,
    },
  }
}

export const subscribeTicker = () => {
  return {
    type: WEBSOCKET_SEND,
    payload: {
      event: 'subscribe',
      channel: 'ticker',
      symbol: 'tBTCUSD',
    },
  }
}

export const unsubscribe = chanId => {
  return {
    type: WEBSOCKET_SEND,
    payload: {
      event: 'unsubscribe',
      chanId,
    },
  }
}

export const checkAlive = () => ({
  type: CHECK_ALIVE,
})

const initialState = {
  open: false,
  alive: false,
  connecting: false,
  channels: {},
  data: {},
  precision: 'P0',
}

// Reducer
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_MESSAGE:
      const data = JSON.parse(action.payload.data, 3)
      const channel = data[0]
      if (Array.isArray(data)) {
        if (data[1] === 'hb') { // hearteat
          return {
            ...state,
            alive: true,
          }
        } else if (Array.isArray(data[1]) && Array.isArray(data[1][0])) { // received array of arrays = initial data for trades or books, populate
          if (channel === state.channels.book) {
            const bids = data[1].filter(i => i[2] > 0)
            const asks = data[1].filter(i => i[2] < 0)
            return {
              ...state,
              alive: true,
              data: {
                ...state.data,
                [`${channel}`]: {
                  bids: arrayToMap(bids),
                  asks: arrayToMap(asks),
                },
              },
            }
          } else {
            return {
              ...state,
              alive: true,
              data: {
                ...state.data,
                [`${channel}`]: data[1],
              },
            }
          }
        } else if (channel === state.channels.trades && data[1] === 'tu') { // updated trades data, update
          const newData = state.data[`${channel}`].slice(0, -1)
          newData.unshift(data[2])
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${channel}`]: newData,
            },
          }
        } else if (channel === state.channels.book) { // updated books data, update
          const count = data[1][1]
          const amount = data[1][2]
          const key = data[1][0]

          const bids = new Map(state.data[`${channel}`].bids)
          const asks = new Map(state.data[`${channel}`].asks)

          if (count > 0) {
            if (amount > 0) {
              bids.set(key, data[1].slice(1))
            } else if (amount < 0) {
              asks.set(key, data[1].slice(1))
            }
          } else if (count === 0) {
            if (amount === 1) {
              bids.delete(key)
            } else if (amount === -1) {
              asks.delete(key)
            }
          }

          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${channel}`]: {
                bids,
                asks,
              },
            },
          }
        } else if (channel === state.channels.ticker) { // updated ticker data, update
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${channel}`]: data[1],
            },
          }
        }
      } else if (data.event === 'subscribed') { // subscribe event, populate channels' ids
        return {
          ...state,
          alive: true,
          channels: {
            ...state.channels,
            [`${data.channel}`]: data.chanId,
          },
          precision: data.prec || state.precision,
        }
      }
      return {
        ...state,
        alive: true,
      }
    case WEBSOCKET_OPEN:
      return {
        ...state,
        open: true,
        alive: true,
        connecting: false,
      }
    case WEBSOCKET_CLOSED:
      return {
        ...state,
        open: false,
        alive: false,
      }
    case WEBSOCKET_CONNECT:
      return {
        ...state,
        connecting: true,
      }
    case WEBSOCKET_DISCONNECT:
      return {
        ...state,
        open: false,
        alive: false,
      }
    case CHECK_ALIVE:
      return {
        ...state,
        alive: false,
      }
    default:
      return state
  }
}
