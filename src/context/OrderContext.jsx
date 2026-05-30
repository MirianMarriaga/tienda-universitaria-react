import { createContext, useReducer } from 'react'
import { orders as initialOrders } from '../data/orders'
import { orderReducer } from '../reducers/orderReducer'

export const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: initialOrders
  })

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}