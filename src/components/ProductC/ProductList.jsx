function ProductList({ products, categories, loading, error, onEdit, onDetail }) {

  if (loading) return <p className="center-text muted-text">Cargando productos...</p>
  if (error)   return <p className="center-text error-text">{error}</p>

  const getCategoryName = (categoryId) => {
    const cat = categories?.find(c => c.id === categoryId)
    return cat ? cat.name : categoryId
  }

  return (
    <div className="table-wrapper">
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
              <td>
                <span className="mono" style={{ color: 'var(--text-sub)' }}>
                  {product.sku}
                </span>
              </td>
              <td style={{ fontWeight: 500, color: 'var(--text-h)' }}>
                {product.name}
              </td>
              <td>
                <span className="badge badge-blue">
                  {getCategoryName(product.categoryId)}
                </span>
              </td>
              <td>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--text-h)' }}>
                  ${Number(product.price).toLocaleString()}
                </span>
              </td>
              <td>
                <span className={product.active ? 'badge badge-green' : 'badge badge-red'}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-detail" onClick={() => onDetail && onDetail(product)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Ver
                  </button>
                  <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => onEdit(product)}>
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="center-text muted-text">No se encontraron productos</p>
      )}
    </div>
  )
}

export default ProductList