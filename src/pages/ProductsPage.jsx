import { useContext, useState, useEffect } from 'react'  // ← agrega useEffect

import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'

import { ProductContext } from '../context/ProductContext'
import { getCategories } from '../services/categoryService'  // ← importa esto

import {
  createProduct,
  updateProduct
} from '../services/productService'

function ProductsPage() {

  const { state, loadProducts } = useContext(ProductContext)

  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState([])  // ← estado local de categorías

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
    const { id, ...rest } = productData  // ← fix del mismo bug que tenías en customers
    await updateProduct(id, rest)
    await loadProducts()
    setEditingProduct(null)
    setShowForm(false)
  }

  function handleEdit(product) {  // ← faltaba esta función
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
          categories={categories}  // ← ahora viene del estado local
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ProductList
        products={state.products}
        categories={categories}  // ← también aquí
        onEdit={handleEdit}
      />

    </section>
  )
}

export default ProductsPage