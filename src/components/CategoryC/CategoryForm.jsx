import { useState } from 'react'

function CategoryForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
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

    setErrors({})

    onCreate({ name, description })

    setName('')
    setDescription('')
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Nueva categoría</h3>

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <br />

        <input
          type="text"
          id="name"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <br />

        <textarea
          id="description"
          placeholder="Descripción de la categoría"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button type="submit" className="btn-primary">
          Agregar categoría
        </button>
      </div>
    </form>
  )
}

export default CategoryForm