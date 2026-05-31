import { createContext, useContext, useReducer } from 'react'
import productReducer from '../reducers/productReducer'
import { products } from '../data/products'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {

  const [state, dispatch] = useReducer(productReducer, {
    products,
    loading: false,
    error: null,
    selected: null
  })

  const addProduct = (product) => {

    dispatch({
      type: 'ADD_PRODUCT',
      payload: {
        id: Date.now(),
        active: true,
        ...product
      }
    })
  }

  const editProduct = (id, product) => {

    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        id,
        ...product
      }
    })

    dispatch({
      type: 'CLEAR_SELECTED'
    })
  }

  const editInventory = (id, inventory) => {

    const currentProduct =
      state.products.find(p => p.id === id)

    if (!currentProduct) return

    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        ...currentProduct,
        inventory
      }
    })
  }

  const selectProduct = (product) => {

    dispatch({
      type: 'SELECT_PRODUCT',
      payload: product
    })
  }

  const clearSelected = () => {

    dispatch({
      type: 'CLEAR_SELECTED'
    })
  }

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        loading: state.loading,
        error: state.error,
        selected: state.selected,
        addProduct,
        editProduct,
        editInventory,
        selectProduct,
        clearSelected
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () =>
  useContext(ProductContext)

export default ProductContext