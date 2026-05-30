export const orderActions = {
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  CANCEL_ORDER: 'CANCEL_ORDER'
}

export function orderReducer(state, action) {
  switch (action.type) {
    case orderActions.ADD_ORDER:
      return {
        ...state,
        orders: [
          ...state.orders,
          {
            id: Math.max(...state.orders.map(o => o.id)) + 1,
            ...action.payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    case orderActions.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status, updatedAt: new Date().toISOString() }
            : order
        )
      }
    case orderActions.CANCEL_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, status: 'CANCELLED', updatedAt: new Date().toISOString() }
            : order
        )
      }
    default:
      return state
  }
}