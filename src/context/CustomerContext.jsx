import { createContext, useReducer } from 'react'

import { customers as initialCustomers } from '../data/customers'

import { customerReducer } from '../reducers/customerReducer'

export const CustomerContext = createContext()

export function CustomerProvider({ children }) {

  const [state, dispatch] = useReducer(customerReducer, {

    customers: initialCustomers,
    loading: false,
    error: null,
    selected: null
  })

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}