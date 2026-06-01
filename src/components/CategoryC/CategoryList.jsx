function CategoryList({ categories, onEdit, products = [] }) {  // ← recibe products

  function countProducts(categoryId) {
    return products.filter((p) => p.categoryId === categoryId).length  // ← usa el prop
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Productos</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CategoryList