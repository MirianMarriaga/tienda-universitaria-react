import { useEffect, useState } from 'react'

function InventoryForm({ editingItem, onUpdate, onCancel }) {
  const [availableStock, setAvailableStock] = useState('')
  const [minimumStock, setMinimumStock]     = useState('')

  useEffect(() => {
    if (editingItem) {
      setAvailableStock(editingItem.availableStock)
      setMinimumStock(editingItem.minimumStock)
    }
  }, [editingItem])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdate({ ...editingItem, availableStock: Number(availableStock), minimumStock: Number(minimumStock) })
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Actualizar Inventario</h3>
      <div className="form-grid">
        <div>
          <label>Stock disponible</label>
          <input
            className="input"
            type="number"
            min="0"
            value={availableStock}
            onChange={e => setAvailableStock(e.target.value)}
          />
        </div>
        <div>
          <label>Stock mínimo</label>
          <input
            className="input"
            type="number"
            min="0"
            value={minimumStock}
            onChange={e => setMinimumStock(e.target.value)}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar cambios</button>
      </div>
    </form>
  )
}

export default InventoryForm