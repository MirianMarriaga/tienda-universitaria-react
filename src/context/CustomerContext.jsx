import { createContext, useContext, useReducer } from 'react'
import customerReducer from '../reducers/customerReducer'
import { customers } from '../data/customers'

const CustomerContext = createContext()

export const CustomerProvider = ({ children }) => {

  const [state, dispatch] = useReducer(customerReducer, {
    customers,
    loading: false,
    error: null,
    selected: null
  })

  const addCustomer = (customer) => {

    dispatch({
      type: 'ADD_CUSTOMER',
      payload: {
        id: Date.now(),
        ...customer
      }
    })
  }

  const editCustomer = (id, customer) => {

    dispatch({
      type: 'UPDATE_CUSTOMER',
      payload: {
        id,
        ...customer
      }
    })

    dispatch({
      type: 'CLEAR_SELECTED'
    })
  }

  const selectCustomer = (customer) => {

    dispatch({
      type: 'SELECT_CUSTOMER',
      payload: customer
    })
  }

  const clearSelected = () => {

    dispatch({
      type: 'CLEAR_SELECTED'
    })
  }

  return (
    <CustomerContext.Provider
      value={{
        customers: state.customers,
        loading: state.loading,
        error: state.error,
        selected: state.selected,
        addCustomer,
        editCustomer,
        selectCustomer,
        clearSelected
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomers = () =>
  useContext(CustomerContext)

export default CustomerContext