import { useEffect, useState } from 'react'

function CategoryForm({ editingCategory, onCreate, onUpdate, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setDescription(editingCategory.description)
    } else {
      setName('')
      setDescription('')
    }
  }, [editingCategory])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    if (editingCategory) {
      onUpdate({ ...editingCategory, name, description })
    } else {
      onCreate({ name, description })
    }

    setName('')
    setDescription('')
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingCategory ? 'Editar categoría' : 'Nueva categoría'}</h3>
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <input
          type="text"
          placeholder="Descripción de la categoría"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        {editingCategory && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary">
          {editingCategory ? 'Guardar cambios' : '+ Nueva Categoría'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm