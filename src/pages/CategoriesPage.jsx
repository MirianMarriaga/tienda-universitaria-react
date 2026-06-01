import { useEffect, useState, useContext } from 'react'
import CategoryForm from '../components/CategoryC/CategoryForm'
import CategoryList from '../components/CategoryC/CategoryList'
import { createCategory, getCategories } from '../services/categoryService'
import { getAllProducts } from '../services/productService'
import { ProductContext } from '../context/ProductContext'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [search, setSearch]         = useState('')

  const { dispatch } = useContext(ProductContext)

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => { loadCategories(); loadProducts() }, [])

  async function loadCategories() {
    setLoading(true); setError('')
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : data.content ?? [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function loadProducts() {
    try {
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : data.content ?? [])
    } catch (err) { console.error('Error cargando productos:', err) }
  }

  async function handleCreate(newCategory) {
    setError('')
    try {
      const created = await createCategory(newCategory)
      const updated = [...categories, created]
      setCategories(updated)
      dispatch({ type: 'SET_CATEGORIES', payload: updated })
      setShowForm(false)
    } catch (err) { setError(err.message) }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Categorías</h2>
          <p>Organiza el catálogo por tipo de producto</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar formulario' : '+ Nueva Categoría'}
        </button>
      </div>

      {loading && <p className="center-text muted-text">Cargando categorías...</p>}
      {error   && <p className="error-text">{error}</p>}

      {showForm && (
        <CategoryForm
          onCreate={handleCreate}
          onCancel={() => { setShowForm(false); setError('') }}
        />
      )}

      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 2 }}>
          <label className="filter-label">Buscar</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 34 }}
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
        <div className="filter-count">
          {filteredCategories.length} de {categories.length}
        </div>
      </div>

      <CategoryList categories={filteredCategories} products={products} />
    </section>
  )
}

export default CategoriesPage