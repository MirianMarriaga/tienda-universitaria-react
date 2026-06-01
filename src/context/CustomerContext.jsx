import { createContext, useContext, useEffect, useReducer } from 'react'
import { customerReducer, customerActions, initialState } from '../reducers/customerReducer'
import { getAllCustomers, createCustomer, updateCustomer } from '../services/customerService'

export const CustomerContext = createContext()

export function useCustomers() {
  return useContext(CustomerContext)
}

export function CustomerProvider({ children }) {

  const [state, dispatch] = useReducer(customerReducer, initialState)

  async function loadCustomers() {
    dispatch({ type: customerActions.SET_LOADING, payload: true })
    try {
      const data = await getAllCustomers()
      dispatch({
        type: customerActions.SET_CUSTOMERS,
        payload: Array.isArray(data) ? data : data.content ?? []
      })
    } catch (error) {
      dispatch({ type: customerActions.SET_ERROR, payload: 'Error cargando clientes' })
    } finally {
      dispatch({ type: customerActions.SET_LOADING, payload: false })
    }
  }

  async function addCustomer(customerData) {
    try {
      const created = await createCustomer(customerData)
      dispatch({ type: customerActions.ADD_CUSTOMER, payload: created })
    } catch (error) {
      dispatch({ type: customerActions.SET_ERROR, payload: error.message })
    }
  }

  async function editCustomer(id, customerData) {
    try {
      const updated = await updateCustomer(id, customerData)
      dispatch({ type: customerActions.UPDATE_CUSTOMER, payload: updated })
    } catch (error) {
      dispatch({ type: customerActions.SET_ERROR, payload: error.message })
    }
  }

  function selectCustomer(customer) {
    dispatch({ type: customerActions.SET_SELECTED, payload: customer })
  }

  function clearSelected() {
    dispatch({ type: customerActions.SET_SELECTED, payload: null })
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <CustomerContext.Provider value={{
      state,
      dispatch,
      loadCustomers,
      addCustomer,
      editCustomer,
      selectCustomer,
      clearSelected
    }}>
      {children}
    </CustomerContext.Provider>
  )
}