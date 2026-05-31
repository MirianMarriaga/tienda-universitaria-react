import { useContext, useState } from 'react'

import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'

import { ProductContext } from '../context/ProductContext'
import { productActions } from '../reducers/productReducer'

function ProductsPage() {

  const { state, dispatch } = useContext(ProductContext)

  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function handleCreate(newProduct) {

    dispatch({
      type: productActions.ADD_PRODUCT,
      payload: newProduct
    })

    setShowForm(false)
  }

  function handleUpdate(updatedProduct) {

    dispatch({
      type: productActions.UPDATE_PRODUCT,
      payload: updatedProduct
    })

    setEditingProduct(null)
    setShowForm(false)
  }

  function handleEdit(product) {

    setEditingProduct(product)
    setShowForm(true)
  }

  function handleCancel() {

    setEditingProduct(null)
    setShowForm(false)
  }

  function handleToggleForm() {

    if (showForm) {
      setEditingProduct(null)
      setShowForm(false)
      return
    }

    setEditingProduct(null)
    setShowForm(true)
  }

  return (
    <section>

      <div className="page-header">

        <div>
          <h2>Productos</h2>
          <p>
            Administración de productos
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleToggleForm}
        >
          {showForm
            ? 'Cerrar formulario'
            : '+ Nuevo Producto'}
        </button>

      </div>

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          categories={state.categories || []}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      <ProductList
        products={state.products}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
      />

    </section>
  )
}

export default ProductsPage