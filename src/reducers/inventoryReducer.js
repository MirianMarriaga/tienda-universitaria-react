export const inventoryActions = {
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  DECREASE_STOCK: 'DECREASE_STOCK',
  RESTORE_STOCK: 'RESTORE_STOCK'
}

export function inventoryReducer(state, action) {
  switch (action.type) {
    case inventoryActions.UPDATE_INVENTORY:
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload, updatedAt: new Date().toISOString() } : item
        )
      }
    default:
      return state
  }
};