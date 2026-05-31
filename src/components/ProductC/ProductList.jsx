function ProductList({
    products = [],
    categories = [],
    onEdit
  }) {
  
    function getCategoryName(categoryId) {
  
      const category = categories.find(
        (c) => c.id === categoryId
      )
  
      return category
        ? category.name
        : 'Sin categoría'
    }
  
    function getStatusClass(active) {
  
      return active
        ? 'badge-success'
        : 'badge-error'
    }
  
    return (
  
      <div>
  
        <table className="table">
  
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
  
          <tbody>
  
            {products.map((product) => (
  
              <tr key={product.id}>
  
                <td>
                  <div className="product-name-cell">
  
                    <span className="product-icon">
                      📦
                    </span>
  
                    <strong>
                      {product.name}
                    </strong>
  
                  </div>
                </td>
  
                <td>{product.sku}</td>
  
                <td>
                  {getCategoryName(
                    product.categoryId
                  )}
                </td>
  
                <td>
                  $
                  {Number(
                    product.price
                  ).toLocaleString()}
                </td>
  
                <td>
  
                  <span
                    className={getStatusClass(
                      product.active
                    )}
                  >
                    {product.active
                      ? 'Activo'
                      : 'Inactivo'}
                  </span>
  
                </td>
  
                <td>
  
                  <button
                    className="btn-outline"
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </button>
  
                </td>
  
              </tr>
  
            ))}
  
          </tbody>
  
        </table>
  
        {products.length === 0 && (
          <p className="center-text muted-text">
            No products found
          </p>
        )}
  
      </div>
    )
  }
  
  export default ProductList