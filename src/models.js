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
      if (Array.isArray(data)) {
        if (data[1] === 'hb') { // hearteat, just skip
          return {
            ...state,
            alive: true,
          }
        } else if (typeof data[1] === 'object' && data[1].length >= 30) { // initial data, populate
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${data[0]}`]: data[1].reduce((acc, cur) => {
                acc[cur[0]] = cur.slice(1)
                return acc
              }, {}),
            },
          }
        } else if (data[1] === 'tu') { // updated trades data, update
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${data[0]}`]: {
                ...(state.data[data[0]] ? state.data[data[0]] : []),
                [`${data[2][0]}`]: data[2].slice(1),
              },
            },
          }
        } else if (data.length === 2 && data[1].length === 3) { // updated books data, update
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${data[0]}`]: {
                ...(state.data[data[0]] ? state.data[data[0]] : []),
                [`${data[1][0]}`]: data[1].slice(1),
              },
            },
          }
        } else if (data.length === 2 && data[1].length === 10) { // updated ticker data, update
          return {
            ...state,
            alive: true,
            data: {
              ...state.data,
              [`${data[0]}`]: data[1],
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
