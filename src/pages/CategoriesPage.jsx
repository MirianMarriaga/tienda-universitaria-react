import { useEffect, useState, useContext } from 'react'
import CategoryForm from '../components/CategoryC/CategoryForm'
import CategoryList from '../components/CategoryC/CategoryList'
import { createCategory, getCategories } from '../services/categoryService'
import { getAllProducts } from '../services/productService'
import { ProductContext } from '../context/ProductContext'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const { dispatch } = useContext(ProductContext)

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    loadCategories()
    loadProducts()
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

  async function loadProducts() {
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
      const updatedCategories = [...categories, created]
      setCategories(updatedCategories)
      dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories })
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

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {showForm && (
        <CategoryForm onCreate={handleCreate} onCancel={handleCancel} />
      )}

      <CategoryList
        categories={filteredCategories}
        products={products}
      />
    </section>
  )
}

export default CategoriesPage