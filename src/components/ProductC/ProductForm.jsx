import { useState, useEffect } from 'react'

const ProductForm = ({ editingProduct, categories, onCreate, onUpdate, onCancel }) => {

  const [form, setForm] = useState({
    sku: '',
    category: '',
    name: '',
    description: '',
    price: '',
    active: true
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingProduct) {
      setForm({
        sku: editingProduct.sku || '',
        category: editingProduct.categoryId || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        active: editingProduct.active ?? true
      })
    } else {
      setForm({ sku: '', category: '', name: '', description: '', price: '', active: true })
    }
    setErrors({})
  }, [editingProduct])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.sku.trim())        newErrors.sku = 'SKU is required'
    if (!form.category)          newErrors.category = 'Category is required'
    if (!form.name.trim())       newErrors.name = 'Name is required'
    if (!form.price)             newErrors.price = 'Price is required'
    if (Number(form.price) <= 0) newErrors.price = 'Price must be greater than zero'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (editingProduct) {
      await onUpdate({
        id: editingProduct.id,
        category: Number(form.category),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        active: form.active
      })
    } else {
      await onCreate({
        sku: form.sku,
        category: Number(form.category),
        name: form.name,
        description: form.description,
        price: Number(form.price)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-4">
        {editingProduct ? 'Edit Product' : 'New Product'}
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            disabled={!!editingProduct}
            className={`w-full border rounded p-2 ${
              editingProduct ? 'bg-gray-100' : ''
            } ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>

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

        {editingProduct && (
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm font-medium">Active</label>
          </div>
        )}

      </div>

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {editingProduct ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm