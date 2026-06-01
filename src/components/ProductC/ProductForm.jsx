import { useEffect, useState } from 'react'

function ProductForm({ editingProduct, categories, onCreate, onUpdate, onCancel }) {

  const [sku, setSku]                 = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]             = useState('')
  const [active, setActive]           = useState(true)
  const [errors, setErrors]           = useState({})

  useEffect(() => {
    if (editingProduct) {
      setSku(editingProduct.sku)
      setCategoryId(editingProduct.categoryId)
      setName(editingProduct.name)
      setDescription(editingProduct.description || '')
      setPrice(editingProduct.price)
      setActive(editingProduct.active)
    } else {
      setSku('')
      setCategoryId('')
      setName('')
      setDescription('')
      setPrice('')
      setActive(true)
    }
    setErrors({})
  }, [editingProduct])

  function validate() {
    const newErrors = {}
    if (!sku.trim())        newErrors.sku = 'El SKU es obligatorio'
    if (!categoryId)        newErrors.categoryId = 'La categoría es obligatoria'
    if (!name.trim())       newErrors.name = 'El nombre es obligatorio'
    if (!price)             newErrors.price = 'El precio es obligatorio'
    if (Number(price) <= 0) newErrors.price = 'El precio debe ser mayor a 0'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const productData = {
      sku,
      category: Number(categoryId),
      name,
      description,
      price: Number(price),
      active
    }

    if (editingProduct) {
      onUpdate({ ...editingProduct, ...productData })
    } else {
      onCreate(productData)
    }
  }


  if (editingProduct) {
    return (
      <form onSubmit={handleSubmit}>

        <div className="detail-grid">

          <div className="detail-field">
            <p className="detail-label">Nombre</p>
            <input
              className="detail-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">SKU</p>
            <input
              className="detail-input mono"
              type="text"
              value={sku}
              disabled
            />
          </div>

          <div className="detail-field">
            <p className="detail-label">Categoría</p>
            <select
              className="detail-input"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">Seleccione</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="error-text">{errors.categoryId}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">Precio</p>
            <input
              className="detail-input mono"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">Descripción</p>
            <input
              className="detail-input"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="detail-field">
            <p className="detail-label">Estado</p>
            <select
              className="detail-input"
              value={active ? 'ACTIVE' : 'INACTIVE'}
              onChange={e => setActive(e.target.value === 'ACTIVE')}
              style={{
                color: active ? '#065f46' : '#991b1b',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <option value="ACTIVE">● Activo</option>
              <option value="INACTIVE">● Inactivo</option>
            </select>
          </div>

        </div>

      
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          paddingTop: 16,
          borderTop: '1px solid #f0f1f3',
          marginTop: 20
        }}>
          <button type="button" className="btn-outline" onClick={onCancel}>
            Cerrar
          </button>
          <button type="submit" className="btn-primary">
            Guardar cambios
          </button>
        </div>

      </form>
    )
  }


  return (
    <form className="form-container" onSubmit={handleSubmit}>

      <h3>Nuevo producto</h3>

      <div className="form-grid">

        <div>
          <label>SKU</label>
          <input
            className="input"
            type="text"
            value={sku}
            onChange={e => setSku(e.target.value)}
          />
          {errors.sku && <p className="error-text">{errors.sku}</p>}
        </div>

        <div>
          <label>Categoría</label>
          <select
            className="input"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">Seleccione</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="error-text">{errors.categoryId}</p>}
        </div>

        <div>
          <label>Nombre</label>
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div>
          <label>Precio</label>
          <input
            className="input"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            className="input"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          + Nuevo Producto
        </button>
      </div>

    </form>
  )
}

export default ProductForm