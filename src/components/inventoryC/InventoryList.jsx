import { products } from '../../data/products'

function InventoryList({ inventory, onUpdate }) {
    function getProductName(productId) {
        const product = products.find((p) => p.id === productId)
        return product ? product.name : 'Producto Desconocido'
    }

    function getProductSku(productId) {
        const product = products.find((p) => p.id === productId)
        return product ? product.sku : '-'
    }

    function getStatus(item) {
        if (item.availableStock  === 0) return 'Sin stock'
        if (item.availableStock < item.minimumStock) return 'Crítico'
        return 'Ok'
    }

    function getStockLevel(item) {
  const ratio = item.availableStock / item.minimumStock
  const percent = Math.min(ratio * 100, 100)
  const color = item.availableStock === 0 ? '#6b7280' 
    : item.availableStock < item.minimumStock ? '#ef4444' 
    : '#22c55e'
  return (
    <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8, width: 100 }}>
      <div style={{ width: `${percent}%`, background: color, height: 8, borderRadius: 4 }} />
    </div>
  )
}

   return (
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
        {inventory.map((item) => {
          const status = getStatus(item)
          return (
            <tr key={item.id}>
              <td>{getProductName(item.productId)}</td>
              <td style={{ color: '#6b7280' }}>{getProductSku(item.productId)}</td>
              <td style={{ fontWeight: 600 }}>{item.availableStock}</td>
              <td style={{ color: status === 'Sin stock' ? '#6b7280' : status === 'Crítico' ? '#ef4444' : '#374151' }}>
                {item.minimumStock}
                </td>
              <td>
                <span className={`badge ${
                    status === 'OK' ? 'badge-green' 
                    : status === 'Crítico' ? 'badge-red' 
                    : 'badge-gray'
                    }`}>
                    {status}
                    </span>
              </td>
              <td>{getStockLevel(item)}</td>
              <td>
                <button className="btn-outline" onClick={() => onUpdate(item)}>
                  ✏️ Actualizar Inventario
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default InventoryList