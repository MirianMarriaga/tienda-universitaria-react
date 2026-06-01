export const productActions = {
  SET_PRODUCTS:   'SET_PRODUCTS',
  SET_CATEGORIES: 'SET_CATEGORIES',   
  ADD_PRODUCT:    'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  SET_LOADING:    'SET_LOADING',
  SET_ERROR:      'SET_ERROR',
  SELECT_PRODUCT: 'SELECT_PRODUCT',
  CLEAR_SELECTED: 'CLEAR_SELECTED'
}

export function productReducer(state, action) {
  switch (action.type) {

    case productActions.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false, error: null }

    case productActions.SET_CATEGORIES:          // ← case que faltaba
      return { ...state, categories: action.payload }

    case productActions.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload], loading: false, error: null }

    case productActions.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload, updatedAt: new Date().toISOString() }
            : item
        ),
        loading: false,
        error: null
      }

    case productActions.SET_LOADING:
      return { ...state, loading: action.payload, error: null }

    case productActions.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    case productActions.SELECT_PRODUCT:
      return { ...state, selected: action.payload }

    case productActions.CLEAR_SELECTED:
      return { ...state, selected: null }

    default:
      return state
  }
}

export default productReducer