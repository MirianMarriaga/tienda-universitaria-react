import { useEffect, useState } from 'react'
import InventoryForm from '../components/inventoryC/InventoryForm'
import InventoryList from '../components/inventoryC/InventoryList'
import { getInventoryByProduct, updateInventory } from '../services/inventoryService'
import { getAllProducts } from '../services/productService'

function InventoriesPage() {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    setLoading(true)
    setError('')
    try {
      const data = await getAllProducts()
      const productList = Array.isArray(data) ? data : data.content ?? []
      setProducts(productList)

      // por cada producto trae su inventario
      const inventoryData = await Promise.all(
        productList.map(p =>
          getInventoryByProduct(p.id)
            .then(inv => ({
              productId: p.id,
              availableStock: inv.availableStock,
              minimumStock: inv.minimumStock,
            }))
            .catch(() => ({
              productId: p.id,
              availableStock: 0,
              minimumStock: 0,
            }))
        )
      )
      setInventory(inventoryData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(updatedItem) {
    try {
      await updateInventory(updatedItem.productId, {
        availableStock: updatedItem.availableStock,
        minimumStock: updatedItem.minimumStock
      })
      setInventory(prev =>
        prev.map(item => item.productId === updatedItem.productId ? updatedItem : item)
      )
      setEditingItem(null)
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
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

      {loading && <p>Cargando inventario...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {showForm && (
        <InventoryForm
          editingItem={editingItem}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      <InventoryList
        inventory={inventory}
        products={products}
        onUpdate={handleEdit}
      />
    </section>
  )
}

export default InventoriesPage