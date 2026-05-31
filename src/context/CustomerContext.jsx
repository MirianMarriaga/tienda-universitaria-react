import { createContext, useEffect, useReducer } from 'react'
import { customerReducer } from '../reducers/customerReducer'

import { getCustomers } from '../services/customerService'

export const CustomerContext = createContext()

export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(customerReducer, {
    customers: [],
    loading: false,
    error: null,
    selected: null
  })

  async function loadCustomers() {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const data = await getCustomers()

      dispatch({
        type: 'SET_CUSTOMERS',
        payload: data
      })

    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Error cargando clientes'
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <CustomerContext.Provider value={{ state, dispatch, loadCustomers }}>
      {children}
    </CustomerContext.Provider>
  )
}