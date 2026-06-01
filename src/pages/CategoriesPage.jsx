import { useEffect, useState } from 'react'
import CategoryForm from '../components/CategoryC/CategoryForm'
import CategoryList from '../components/CategoryC/CategoryList'
import { createCategory, getCategories } from '../services/categoryService'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    loadCategories()
  }, [])
 
  
  async function loadCategories() {
    setLoading(true)
    setError('')
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(newCategory) {
  setError('')
  try {
    const created = await createCategory(newCategory)
    setCategories((prev) => [...prev, created])
    setShowForm(false)
  } catch (err) {
    setError(err.message)
  }
}

  async function handleCancel() {
    setError('')
    setShowForm(false)
  }

  async function handleUpdate(customerData) {
  const { id, ...rest } = customerData 
  await updateCustomer(id, rest)
  await loadCustomers()
  setEditingCustomer(null)
  setShowForm(false)
}

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Categorías</h2>
          <p>Organiza el catálogo por tipo de producto</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nueva Categoría
        </button>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {showForm && (
        <CategoryForm
          onCreate={handleCreate}
          onCancel={handleCancel}
        />
      )}

      <CategoryList
        categories={filteredCategories}
      />
    </section>
  )
}

export default CategoriesPage