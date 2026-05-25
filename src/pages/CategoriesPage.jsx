import { useContext, useState } from 'react'
import CategoryForm from '../components/CategoryC/CategoryForm'
import CategoryList from '../components/CategoryC/CategoryList'
import { CategoryContext } from '../context/CategoryContext'
import { categoryActions } from '../reducers/categoryReducer'

function CategoriesPage() {
  const { state, dispatch } = useContext(CategoryContext)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function handleCreate(newCategory) {
    dispatch({ type: categoryActions.ADD_CATEGORY, payload: newCategory })
    setShowForm(false)
  }

  function handleUpdate(updatedCategory) {
    dispatch({ type: categoryActions.UPDATE_CATEGORY, payload: updatedCategory })
    setEditingCategory(null)
    setShowForm(false)
  }

  function handleEdit(category) {
    setEditingCategory(category)
    setShowForm(true)
  }

  function handleCancel() {
    setEditingCategory(null)
    setShowForm(false)
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Categorías</h2>
          <p>Organiza el catálogo por tipo de producto</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingCategory(null); setShowForm(true) }}>
          + Nueva Categoría
        </button>
      </div>

      {showForm && (
        <CategoryForm
          editingCategory={editingCategory}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      <CategoryList
        categories={state.categories}
        onEdit={handleEdit}
      />
    </section>
  )
}

export default CategoriesPage