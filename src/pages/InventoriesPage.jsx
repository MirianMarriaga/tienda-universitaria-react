import { useContext, useState } from 'react'
import InventoryForm from '../components/inventoryC/InventoryForm'
import InventoryList from '../components/inventoryC/InventoryList'
import { InventoryContext } from '../context/InventoryContext'
import { inventoryActions } from '../reducers/inventoryReducer'

function InventoriesPage() {
  const { state, dispatch } = useContext(InventoryContext)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function handleUpdate(updatedItem) {
    dispatch({
      type: inventoryActions.UPDATE_INVENTORY,
      payload: updatedItem
    })
    setEditingItem(null)
    setShowForm(false)
  }

  function handleEdit(item) {
    setEditingItem(item)
    setShowForm(true)
  }

  function handleCancel() {
    setEditingItem(null)
    setShowForm(false)
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Inventario</h2>
          <p>Control de stock disponible y mínimos por producto</p>
        </div>
      </div>

      {showForm && (
        <InventoryForm
          editingItem={editingItem}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      <InventoryList
        inventory={state.inventory}
        onUpdate={handleEdit}
      />
    </section>
  )
}

export default InventoriesPage