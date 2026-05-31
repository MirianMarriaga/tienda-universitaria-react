import { useEffect, useState } from 'react'

function ProductForm({
  editingProduct,
  categories,
  onCreate,
  onUpdate,
  onCancel
}) {
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [active, setActive] = useState(true)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingProduct) {
      setSku(editingProduct.sku)
      setCategoryId(editingProduct.categoryId)
      setName(editingProduct.name)
      setDescription(editingProduct.description)
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

    if (!sku.trim()) {
      newErrors.sku =
        'El SKU es obligatorio'
    }

    if (!categoryId) {
      newErrors.categoryId =
        'La categoría es obligatoria'
    }

    if (!name.trim()) {
      newErrors.name =
        'El nombre es obligatorio'
    }

    if (!price) {
      newErrors.price =
        'El precio es obligatorio'
    }

    if (Number(price) <= 0) {
      newErrors.price =
        'El precio debe ser mayor a 0'
    }

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
      categoryId: Number(categoryId),
      name,
      description,
      price: Number(price),
      active
    }

    if (editingProduct) {
      onUpdate({
        ...editingProduct,
        ...productData
      })
    } else {
      onCreate(productData)
    }
  }

  return (
    <form
      className="form-container"
      onSubmit={handleSubmit}
    >
      <h3>
        {editingProduct
          ? 'Editar producto'
          : 'Nuevo producto'}
      </h3>

      <div className="form-grid">

        <div>
          <label>SKU</label>

          <input
            className="input"
            type="text"
            value={sku}
            onChange={(e) =>
              setSku(e.target.value)
            }
          />

          {errors.sku && (
            <p className="error-text">
              {errors.sku}
            </p>
          )}
        </div>

        <div>
          <label>Categoría</label>

          <select
            className="input"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
          >
            <option value="">
              Seleccione
            </option>

            {categories.map(category => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {errors.categoryId && (
            <p className="error-text">
              {errors.categoryId}
            </p>
          )}
        </div>

        <div>
          <label>Nombre</label>

          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {errors.name && (
            <p className="error-text">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Precio</label>

          <input
            className="input"
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

          {errors.price && (
            <p className="error-text">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label>Descripción</label>

          <textarea
            className="input"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

      </div>

      <div className="form-actions">

        {editingProduct && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="btn-primary"
        >
          {editingProduct
            ? 'Guardar cambios'
            : '+ Nuevo Producto'}
        </button>

      </div>
    </form>
  )
}

export default ProductForm