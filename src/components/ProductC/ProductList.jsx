function ProductList({ products, categories, loading, error, onEdit }) {

  if (loading) return <p className="center-text">Loading products...</p>
  if (error) return <p className="center-text error-text">{error}</p>

  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  return (
    <div>

      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>

              <td>{product.sku}</td>

              <td>{product.name}</td>

              <td>{getCategoryName(product.categoryId)}</td>

              <td>
                ${Number(product.price).toLocaleString()}
              </td>

              <td>
                <span
                  className={
                    product.active
                      ? 'badge-success'
                      : 'badge-error'
                  }
                >
                  {product.active ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </td>

              <td>
                <button
                  className="btn-primary"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="center-text muted-text">
          No se encontraron productos
        </p>
      )}

    </div>
  )
}

export default ProductList