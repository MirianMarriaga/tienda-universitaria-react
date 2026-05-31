import { addresses } from '../../data/addresses'

function OrderDetailModal({ order, onClose, onStatusChange }) {
  if (!order) return null

  const address = addresses.find((a) => a.id === order.addressId)

  const statusColors = {
    CREATED: '#2563eb',
    PAID: '#16a34a',
    SHIPPED: '#7c3aed',
    DELIVERED: '#16a34a',
    CANCELLED: '#dc2626'
  }

  const statusLabels = {
    CREATED: 'Creado',
    PAID: 'Pagado',
    SHIPPED: 'Despachado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
  }

  const statusFlow = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED']
  const currentIndex = statusFlow.indexOf(order.status)
  const history = order.status === 'CANCELLED'
    ? [{ status: 'CREATED', date: order.createdAt }, { status: 'CANCELLED', date: order.updatedAt }]
    : statusFlow.slice(0, currentIndex + 1).map((status, i) => ({
        status,
        date: i === 0 ? order.createdAt : order.updatedAt
      }))

  function formatPrice(price) {
    return `$${Number(price).toLocaleString('es-CO')}`
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }

  function getNextAction() {
    switch (order.status) {
      case 'SHIPPED':
        return (
          <button className="btn-success" onClick={() => { onStatusChange(order.id, 'DELIVERED'); onClose() }}>
            ✓ Marcar entregado
          </button>
        )
      case 'PAID':
        return (
          <button className="btn-primary" onClick={() => { onStatusChange(order.id, 'SHIPPED'); onClose() }}>
            Despachar
          </button>
        )
      case 'CREATED':
        return (
          <button className="btn-primary" onClick={() => { onStatusChange(order.id, 'PAID'); onClose() }}>
            Pagar
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h3>Pedido #{order.id}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Dirección */}
          {address && (
            <div className="modal-card">
              <p className="modal-card-label">DIRECCIÓN DE ENVÍO</p>
              <p style={{ fontWeight: 600 }}>{address.city}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{address.street}</p>
            </div>
          )}

          {/* Items */}
          <h4 style={{ margin: '16px 0 8px' }}>Ítems</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.productName}</strong>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{item.sku}</p>
                  </td>
                  <td>{item.quantity}</td>
                  <td style={{ color: '#2563eb' }}>{formatPrice(item.unitPrice)}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(item.subtotal)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}><strong>Total</strong></td>
                <td><strong>{formatPrice(order.total)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* Historial */}
          <h4 style={{ margin: '16px 0 8px' }}>Historial de estados</h4>
          <div className="modal-card">
            {history.map((entry, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" style={{ backgroundColor: statusColors[entry.status] }} />
                <div className="timeline-line" style={{ display: index === history.length - 1 ? 'none' : 'block' }} />
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{statusLabels[entry.status]}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{formatDate(entry.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <span className={`badge badge-${order.status === 'CANCELLED' ? 'red' : order.status === 'DELIVERED' ? 'green' : order.status === 'SHIPPED' ? 'purple' : order.status === 'PAID' ? 'green' : 'blue'}`}>
            {statusLabels[order.status]}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-outline" onClick={onClose}>Cerrar</button>
            {getNextAction()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal