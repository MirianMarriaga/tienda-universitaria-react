import { useEffect, useState } from 'react'

function InventoryForm({ editingItem, onUpdate, onCancel }) {
  const [availableStock, setAvailableStock] = useState(0)
  const [minimumStock, setMinimumStock] = useState(0)

  useEffect(() => {
    if (editingItem) {
      setAvailableStock(editingItem.availableStock)
      setMinimumStock(editingItem.minimumStock)
    }
  }, [editingItem])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdate({
      ...editingItem,
      availableStock: parseInt(availableStock),
      minimumStock: parseInt(minimumStock)
    })
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Actualizar Inventario</h3>
      <div className="form-group">
        <label>Stock disponible</label>
        <input
          type="number"
          min="0"
          value={availableStock}
          onChange={(e) => setAvailableStock(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Stock mínimo</label>
        <input
          type="number"
          min="0"
          value={minimumStock}
          onChange={(e) => setMinimumStock(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar cambios
        </button>
      </div>
    </form>
  )
}

export default InventoryForm