import { useContext, useState } from 'react'

import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'
import Modal from '../Modal'

import { ProductContext } from '../context/ProductContext'
import { productActions } from '../reducers/productReducer'

function ProductsPage() {

  const { state, dispatch } = useContext(ProductContext)

  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  function handleCreate(newProduct) {
    dispatch({ type: productActions.ADD_PRODUCT, payload: newProduct })
    setShowCreateForm(false)
  }

  function handleUpdate(updatedProduct) {
    dispatch({ type: productActions.UPDATE_PRODUCT, payload: updatedProduct })
    setEditingProduct(null)
    setShowEditModal(false)
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  function handleCloseEdit() {
    setEditingProduct(null)
    setShowEditModal(false)
  }

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Productos</h2>
          <p>Administración de productos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateForm(v => !v)}>
          {showCreateForm ? 'Cerrar formulario' : '+ Nuevo Producto'}
        </button>
      </div>

      {showCreateForm && (
        <ProductForm
          editingProduct={null}
          categories={state.categories || []}
          onCreate={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <ProductList
        products={state.products}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
      />

      <Modal
        open={showEditModal}
        title={`Editar producto · ${editingProduct?.name ?? ''}`}
        onClose={handleCloseEdit}
      >
        <ProductForm
          editingProduct={editingProduct}
          categories={state.categories || []}
          onUpdate={handleUpdate}
          onCancel={handleCloseEdit}
        />
      </Modal>

    </section>
  )
}

export default ProductsPage