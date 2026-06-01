import { useContext, useState, useEffect } from 'react'

import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'

import { ProductContext } from '../context/ProductContext'
import { getCategories } from '../services/categoryService'

import {
  createProduct,
  updateProduct
} from '../services/productService'

function ProductsPage() {

  const { state, loadProducts } = useContext(ProductContext)

  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
      .then(data => setCategories(Array.isArray(data) ? data : data.content ?? []))
      .catch(err => console.error('Error cargando categorías:', err))
  }, [])

  async function handleCreate(productData) {
    await createProduct(productData)
    await loadProducts()
    setShowForm(false)
  }

  async function handleUpdate(productData) {
    const { id, ...rest } = productData
    await updateProduct(id, rest)
    await loadProducts()
    setEditingProduct(null)
    setShowForm(false)
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setShowForm(true)
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
          categories={categories}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ProductList
        products={state.products}
        categories={categories}
        onEdit={handleEdit}
      />

    </section>
  )
}

export default ProductsPage