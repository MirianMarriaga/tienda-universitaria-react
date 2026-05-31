import { useContext, useState } from 'react'

import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'

import { ProductContext } from '../context/ProductContext'

import {
  createProduct,
  updateProduct
} from '../services/productService'

function ProductsPage() {

  const { state, loadProducts } = useContext(ProductContext)

  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(productData) {
    await createProduct(productData)
    await loadProducts()
    setShowForm(false)
  }

  async function handleUpdate(productData) {
    await updateProduct(productData)
    await loadProducts()
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Productos</h2>
          <p>Administración de productos</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cerrar formulario' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          categories={state.categories}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ProductList
        products={state.products}
        categories={state.categories}
        onEdit={setEditingProduct}
      />

    </section>
  )
}

export default ProductsPage