import { useContext, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { productActions } from '../reducers/productReducer'
import { createProduct, updateProduct } from '../services/productService'
import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'
import Modal from '../Modal'

function ProductsPage() {

  const { state, dispatch } = useContext(ProductContext)

  const [showForm, setShowForm]             = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal]   = useState(false)
  const [search, setSearch]                = useState('')

  const filteredProducts = state.products.filter((p) => {
    const term = search.toLowerCase()
    const catName = state.categories
      ?.find(c => c.id === p.categoryId)?.name ?? ''
    return (
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)  ||
      catName.toLowerCase().includes(term)
    )
  })

  async function handleCreate(newProduct) {
    dispatch({ type: productActions.SET_LOADING, payload: true })
    try {
      const created = await createProduct(newProduct)
      dispatch({ type: productActions.ADD_PRODUCT, payload: created })
      setShowForm(false)
    } catch {
      dispatch({ type: productActions.SET_ERROR, payload: 'Error creando producto' })
    } finally {
      dispatch({ type: productActions.SET_LOADING, payload: false })
    }
  }

  async function handleUpdate(updatedProduct) {
    dispatch({ type: productActions.SET_LOADING, payload: true })
    try {
      const updated = await updateProduct(editingProduct.id, updatedProduct)
      dispatch({ type: productActions.UPDATE_PRODUCT, payload: updated })
      setShowEditModal(false)
      setEditingProduct(null)
    } catch {
      dispatch({ type: productActions.SET_ERROR, payload: 'Error actualizando producto' })
    } finally {
      dispatch({ type: productActions.SET_LOADING, payload: false })
    }
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  function handleCancelEdit() {
    setShowEditModal(false)
    setEditingProduct(null)
  }

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Productos</h2>
          <p>Administración de productos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar formulario' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <ProductForm
          editingProduct={null}
          categories={state.categories || []}
          onCreate={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, SKU o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <ProductList
        products={filteredProducts}
        categories={state.categories || []}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
      />

      <Modal
        open={showEditModal}
        title={`Producto · ${editingProduct?.name ?? ''}`}
        onClose={handleCancelEdit}
      >
        {editingProduct && (
          <ProductForm
            editingProduct={editingProduct}
            categories={state.categories || []}
            onUpdate={handleUpdate}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>

    </section>
  )
}

export default ProductsPage