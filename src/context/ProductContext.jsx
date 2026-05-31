import { createContext, useContext, useReducer } from 'react'

import { products as initialProducts } from '../data/products'

import { productReducer } from '../reducers/productReducer'

export const ProductContext = createContext()

export function ProductProvider({ children }) {

  const [state, dispatch] = useReducer(productReducer, {

    products: initialProducts,
    loading: false,
    error: null,
    selected: null
  })

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)