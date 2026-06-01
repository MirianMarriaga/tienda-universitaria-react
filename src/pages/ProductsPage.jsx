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

  async function handleCreate(newProduct) {
    dispatch({ type: productActions.SET_LOADING, payload: true })
    try {
      const created = await createProduct(newProduct)
      dispatch({ type: productActions.ADD_PRODUCT, payload: created })
      setShowForm(false)
    } catch (e) {
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
    } catch (e) {
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

      <ProductList
        products={state.products}
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