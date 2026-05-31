export const customerActions = {
    SET_CUSTOMERS:   'SET_CUSTOMERS',
    ADD_CUSTOMER:    'ADD_CUSTOMER',
    UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
    SET_LOADING:     'SET_LOADING',
    SET_ERROR:       'SET_ERROR',
    SELECT_CUSTOMER: 'SELECT_CUSTOMER',
    CLEAR_SELECTED:  'CLEAR_SELECTED'
  }
  
  export function customerReducer(state, action) {
    switch (action.type) {
  
      case customerActions.SET_CUSTOMERS:
        return {
          ...state,
          customers: action.payload,
          loading: false,
          error: null
        }
  
      case customerActions.ADD_CUSTOMER:
        return {
          ...state,
          customers: [...state.customers, action.payload],
          loading: false,
          error: null
        }
  
      case customerActions.UPDATE_CUSTOMER:
        return {
          ...state,
          customers: state.customers.map((item) =>
            item.id === action.payload.id
              ? { ...item, ...action.payload, updatedAt: new Date().toISOString() }
              : item
          ),
          loading: false,
          error: null
        }
  
      case customerActions.SET_LOADING:
        return {
          ...state,
          loading: action.payload,
          error: null
        }
  
      case customerActions.SET_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        }
  
      case customerActions.SELECT_CUSTOMER:
        return {
          ...state,
          selected: action.payload
        }
  
      case customerActions.CLEAR_SELECTED:
        return {
          ...state,
          selected: null
        }
  
      default:
        return state
    }
  } export default customerReducer