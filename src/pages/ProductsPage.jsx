import { useContext, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { productActions } from '../reducers/productReducer'
import { createProduct, updateProduct } from '../services/productService'
import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'
import Modal from '../Modal'

function ProductDetailContent({ product, categories, inventory, onClose }) {
  const getCategoryName = (id) => categories?.find(c => c.id === id)?.name ?? id

  return (
    <>
      <div className="modal-info-grid">
        <div className="modal-info-card">
          <p className="modal-info-label">SKU</p>
          <p className="modal-info-value mono">{product.sku}</p>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Categoría</p>
          <p className="modal-info-value">{getCategoryName(product.categoryId)}</p>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Precio</p>
          <p className="modal-info-value mono">${Number(product.price).toLocaleString()}</p>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Estado</p>
          <span className={product.active ? 'badge badge-green' : 'badge badge-red'}>
            {product.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {product.description && (
        <div style={{ marginBottom: 18 }}>
          <p className="modal-section-title">Descripción</p>
          <p style={{ fontSize:'0.85rem', color:'var(--text-body)', lineHeight:1.6 }}>{product.description}</p>
        </div>
      )}

      {inventory && (
        <div style={{ marginBottom: 18 }}>
          <p className="modal-section-title">Inventario actual</p>
          <div className="modal-info-grid">
            <div className="modal-info-card">
              <p className="modal-info-label">Stock disponible</p>
              <p className="modal-info-value mono">{inventory.availableStock} unidades</p>
            </div>
            <div className="modal-info-card">
              <p className="modal-info-label">Stock mínimo</p>
              <p className="modal-info-value mono">{inventory.minimumStock} unidades</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid var(--border-light)', marginTop:4 }}>
        <button className="btn-outline" onClick={onClose}>Cerrar</button>
      </div>
    </>
  )
}

function ProductsPage() {
  const { state, dispatch } = useContext(ProductContext)

  const [showForm, setShowForm]               = useState(false)
  const [editingProduct, setEditingProduct]   = useState(null)
  const [showEditModal, setShowEditModal]     = useState(false)
  const [detailProduct, setDetailProduct]     = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [search, setSearch]                  = useState('')
  const [filterCategory, setFilterCategory]  = useState('')
  const [filterStatus, setFilterStatus]      = useState('')

  const filteredProducts = state.products.filter((p) => {
    const term = search.toLowerCase()
    const catName = state.categories?.find(c => c.id === p.categoryId)?.name ?? ''
    const matchSearch = p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || catName.toLowerCase().includes(term)
    const matchCategory = filterCategory === '' || String(p.categoryId) === String(filterCategory)
    const matchStatus = filterStatus === '' ? true : filterStatus === 'active' ? p.active === true : p.active === false
    return matchSearch && matchCategory && matchStatus
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
      const { id, categoryId, createdAt, updatedAt, sku, ...rest } = updatedProduct
      const updated = await updateProduct(editingProduct.id, rest)
      dispatch({ type: productActions.UPDATE_PRODUCT, payload: updated })
      setShowEditModal(false)
      setEditingProduct(null)
    } catch {
      dispatch({ type: productActions.SET_ERROR, payload: 'Error actualizando producto' })
    } finally {
      dispatch({ type: productActions.SET_LOADING, payload: false })
    }
  }

  function handleEdit(product)   { setEditingProduct(product); setShowEditModal(true) }
  function handleDetail(product) { setDetailProduct(product);  setShowDetailModal(true) }
  function handleCancelEdit()    { setShowEditModal(false); setEditingProduct(null) }

  const detailInventory = detailProduct
    ? state.inventories?.find(i => i.productId === detailProduct.id)
    : null

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

      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 2 }}>
          <label className="filter-label">Buscar</label>
          <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <span style={{ position:'absolute', left:11, color:'#9ca3af', display:'flex', alignItems:'center', pointerEvents:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 34 }}
              placeholder="Nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Categoría</label>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Todas</option>
            {(state.categories || []).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className="filter-count">
          {filteredProducts.length} de {state.products.length}
        </div>
      </div>

      <ProductList
        products={filteredProducts}
        categories={state.categories || []}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
        onDetail={handleDetail}
      />

      <Modal
        open={showDetailModal}
        title={`Producto · ${detailProduct?.name ?? ''}`}
        subtitle={`SKU: ${detailProduct?.sku ?? ''}`}
        onClose={() => { setShowDetailModal(false); setDetailProduct(null) }}
      >
        {detailProduct && (
          <ProductDetailContent
            product={detailProduct}
            categories={state.categories || []}
            inventory={detailInventory}
            onClose={() => { setShowDetailModal(false); setDetailProduct(null) }}
          />
        )}
      </Modal>

      <Modal
        open={showEditModal}
        title={`Producto · ${editingProduct?.name ?? ''}`}
        subtitle="Editar información del producto"
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