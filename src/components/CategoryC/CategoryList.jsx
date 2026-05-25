import { products } from '../../data/products'

function CategoryList({ categories, onEdit }) {
  function countProducts(categoryId) {
    return products.filter((p) => p.categoryId === categoryId).length
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Productos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>
              <div className="category-name-cell">
                <span className="category-icon">🏷️</span>
                <strong>{category.name}</strong>
              </div>
            </td>
            <td>{category.description}</td>
            <td>{countProducts(category.id)}</td>
            <td>
              <button className="btn-outline" onClick={() => onEdit(category)}>
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CategoryList