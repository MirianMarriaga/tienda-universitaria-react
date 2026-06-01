import { useEffect, useState } from 'react'
import CategoryForm from '../components/CategoryC/CategoryForm'
import CategoryList from '../components/CategoryC/CategoryList'
import { createCategory, getCategories } from '../services/categoryService'
import { getAllProducts } from '../services/productService'  // ← importa esto

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])             // ← agrega esto
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    loadCategories()
    loadProducts()                                          // ← agrega esto
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

  async function loadProducts() {                          // ← agrega esto
    try {
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : data.content ?? [])
    } catch (err) {
      console.error('Error cargando productos:', err)
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
        <CategoryForm onCreate={handleCreate} onCancel={handleCancel} />
      )}

      <CategoryList
        categories={filteredCategories}
        products={products}           // ← pásalos aquí
      />
    </section>
  )
}

export default CategoriesPage