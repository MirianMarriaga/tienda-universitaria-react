import { createContext, useReducer } from 'react'
import { categories as initialCategories } from '../data/categories'
import { categoryReducer } from '../reducers/categoryReducer'

export const CategoryContext = createContext()

export function CategoryProvider({ children }) {
  const [state, dispatch] = useReducer(categoryReducer, {
    categories: initialCategories
  })

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  )
}