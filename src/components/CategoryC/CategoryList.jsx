function CategoryList({ categories, onEdit, products = [] }) {
  function countProducts(categoryId) {
    return products.filter(p => p.categoryId === categoryId).length
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="center-text muted-text">No hay categorías registradas</td>
            </tr>
          )}
          {categories.map(category => (
            <tr key={category.id}>
              <td>
                <div className="category-name-cell">
                  <span>🏷️</span>
                  <strong style={{ color: 'var(--text-h)' }}>{category.name}</strong>
                </div>
              </td>
              <td style={{ color: 'var(--text-sub)' }}>{category.description}</td>
              <td>
                <span className="badge badge-blue">{countProducts(category.id)} productos</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryList