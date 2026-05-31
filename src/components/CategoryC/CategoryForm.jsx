import { useState } from 'react'

function CategoryForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onCreate({ name, description })
    setName('')
    setDescription('')
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Nueva categoría</h3>
      <div className="form-group">
        <label for="name">Nombre</label>
        <br></br>
        <input
          type="text"
          id="name"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label for="description">Descripción</label>
        <br></br>
        <textarea
          id="description"
          placeholder="Descripción de la categoría"
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
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