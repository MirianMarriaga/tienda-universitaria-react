import { createContext, useContext, useEffect, useReducer } from 'react'
import { productReducer } from '../reducers/productReducer'
import { getAllProducts, createProduct, updateProduct } from '../services/productService'
import { getCategories } from '../services/categoryService'

export const ProductContext = createContext()

export function useProducts() {
  return useContext(ProductContext)
}

export function ProductProvider({ children }) {

  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    categories: [],
    loading: false,
    error: null,
    selected: null
  })

  async function loadProducts() {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const products = await getAllProducts()
      const categories = await getCategories()
      dispatch({ type: 'SET_PRODUCTS', payload: products })
      dispatch({ type: 'SET_CATEGORIES', payload: categories })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error cargando productos' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  async function addProduct(productData) {
    try {
      const created = await createProduct(productData)
      dispatch({ type: 'ADD_PRODUCT', payload: created })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  async function editProduct(id, productData) {
    try {
      const updated = await updateProduct(id, productData)
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <ProductContext.Provider value={{
      state,
      dispatch,
      loadProducts,
      addProduct,
      editProduct
    }}>
      {children}
    </ProductContext.Provider>
  )
}