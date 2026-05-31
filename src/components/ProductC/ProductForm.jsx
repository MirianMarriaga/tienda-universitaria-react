import { useState, useEffect } from 'react'
import { useProducts } from '../../context/ProductContext'

const ProductForm = ({ categories }) => {

  const { addProduct, editProduct, selected, clearSelected } = useProducts()

  // Estado del formulario — coincide exactamente con ProductCreateRequest y ProductUpdateRequest
  const [form, setForm] = useState({
    sku: '',
    category: '',   // Long en backend
    name: '',
    description: '',
    price: '',
    active: true    // solo se usa en update
  })

  const [errors, setErrors] = useState({})

  // Cuando cambia "selected" llena o limpia el formulario
  useEffect(() => {
    if (selected) {
      setForm({
        sku: selected.sku || '',
        category: selected.categoryId || '',
        name: selected.name || '',
        description: selected.description || '',
        price: selected.price || '',
        active: selected.active ?? true
      })
    } else {
      setForm({
        sku: '',
        category: '',
        name: '',
        description: '',
        price: '',
        active: true
      })
    }
    setErrors({})
  }, [selected])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Valida el formulario antes de enviar
  const validate = () => {
    const newErrors = {}
    if (!form.sku.trim())         newErrors.sku = 'SKU is required'
    if (!form.category)           newErrors.category = 'Category is required'
    if (!form.name.trim())        newErrors.name = 'Name is required'
    if (!form.price)              newErrors.price = 'Price is required'
    if (Number(form.price) <= 0)  newErrors.price = 'Price must be greater than zero'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (selected) {
      // PUT /api/products/{id}
      // ProductUpdateRequest: { category, name, description, price, active }
      await editProduct(selected.id, {
        category: Number(form.category),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        active: form.active
      })
    } else {
      // POST /api/products
      // ProductCreateRequest: { sku, category, name, description, price }
      await addProduct({
        sku: form.sku,
        category: Number(form.category),
        name: form.name,
        description: form.description,
        price: Number(form.price)
      })
    }

    clearSelected()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-4">
        {selected ? 'Edit Product' : 'New Product'}
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {/* SKU — solo en create, deshabilitado en update */}
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            disabled={!!selected}
            className={`w-full border rounded p-2 ${
              selected ? 'bg-gray-100' : ''
            } ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
          />
        </div>

        {/* Active — solo visible en update */}
        {selected && (
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {selected ? 'Update' : 'Create'}
        </button>

        {selected && (
          <button
            type="button"
            onClick={clearSelected}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductForm