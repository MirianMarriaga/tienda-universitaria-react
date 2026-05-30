import { createContext, useReducer } from 'react'
import { inventory as initialInventory } from '../data/inventories'
import { inventoryReducer } from '../reducers/inventoryReducer'

export const InventoryContext = createContext()

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, {
    inventory: initialInventory
  })

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  )
}