import { useState } from 'react'
import ProductForm from '../components/ProductC/ProductForm'
import ProductList from '../components/ProductC/ProductList'
import { useProducts } from '../context/ProductContext'

const ProductsPage = () => {

  const [showForm, setShowForm] = useState(false)

  const { selected, clearSelected } = useProducts()

  const handleNewProduct = () => {

    if (showForm) {
      setShowForm(false)
      clearSelected()
      return
    }

    clearSelected()
    setShowForm(true)
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={handleNewProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Hide Form' : 'New Product'}
        </button>
      </div>

      {(showForm || selected) && (
        <ProductForm categories={[]} />
      )}

      <ProductList />
    </div>
  )
}

export default ProductsPage