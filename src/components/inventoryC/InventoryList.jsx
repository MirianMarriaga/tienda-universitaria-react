function InventoryList({ inventory, products, onUpdate }) {

  function getProductName(productId) {
    const product = products.find(p => p.id === productId)
    return product ? product.name : `Producto #${productId}`
  }

  function getProductSku(productId) {
    const product = products.find(p => p.id === productId)
    return product?.sku ?? '—'
  }

  function getStockStatus(item) {
    if (item.availableStock === 0)
      return <span className="badge badge-gray">Sin stock</span>
    if (item.availableStock <= item.minimumStock)
      return <span className="badge badge-red">Crítico</span>
    if (item.availableStock <= item.minimumStock * 1.5)
      return <span className="badge badge-red" style={{ background:'#fff7ed', color:'#c2410c' }}>Bajo</span>
    return <span className="badge badge-green">OK</span>
  }

  function getStockBar(item) {
    const max = Math.max(item.minimumStock * 2, item.availableStock, 1)
    const pct = Math.min((item.availableStock / max) * 100, 100)
    const color = item.availableStock === 0 ? '#d1d5db'
      : item.availableStock <= item.minimumStock ? '#ef4444' : '#3b5bdb'
    return (
      <div style={{ height: 8, background: '#f0f2f8', borderRadius: 999, overflow: 'hidden', minWidth: 80 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.3s' }}/>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>SKU</th>
            <th>Stock disponible</th>
            <th>Stock mínimo</th>
            <th>Estado</th>
            <th>Nivel</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 && (
            <tr>
              <td colSpan={7} className="center-text muted-text">Sin registros de inventario</td>
            </tr>
          )}
          {inventory.map(item => (
            <tr key={item.productId}>
              <td style={{ fontWeight: 500, color: 'var(--text-h)' }}>{getProductName(item.productId)}</td>
              <td><span className="mono">{getProductSku(item.productId)}</span></td>
              <td>
                <span className="mono" style={{ fontWeight: 600, color: item.availableStock <= item.minimumStock ? '#dc2626' : 'var(--text-h)' }}>
                  {item.availableStock}
                </span>
              </td>
              <td>
                <span className="mono" style={{ color: item.availableStock <= item.minimumStock ? '#dc2626' : 'var(--text-sub)' }}>
                  {item.minimumStock}
                </span>
              </td>
              <td>{getStockStatus(item)}</td>
              <td style={{ minWidth: 100 }}>{getStockBar(item)}</td>
              <td>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={() => onUpdate(item)}
                >
                  ✏️ Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryList