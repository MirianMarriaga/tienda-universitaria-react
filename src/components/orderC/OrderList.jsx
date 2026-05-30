import { customers } from '../../data/customers'

function OrderList({ orders, onStatusChange, onCancel, onViewDetail }) {

  function getCustomerName(customerId) {
    const customer = customers.find((c) => c.id === customerId)
    return customer ? customer.fullName : 'Desconocido'
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  function formatPrice(price) {
    return `$${Number(price).toLocaleString('es-CO')}`
  }

  function getStatusBadge(status) {
    const styles = {
      CREATED:   'badge-blue',
      PAID:      'badge-green',
      SHIPPED:   'badge-purple',
      DELIVERED: 'badge-green',
      CANCELLED: 'badge-red'
    }
    const labels = {
      CREATED:   'Creado',
      PAID:      'Pagado',
      SHIPPED:   'Despachado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado'
    }
    return <span className={`badge ${styles[status]}`}>{labels[status]}</span>
  }

  function getActions(order) {
    switch (order.status) {
      case 'CREATED':
        return (
          <>
            <button className="btn-outline" onClick={() => onViewDetail(order)}>Ver detalle</button>
            <button className="btn-primary" onClick={() => onStatusChange(order.id, 'PAID')}>Pagar</button>
            <button className="btn-danger" onClick={() => onCancel(order.id)}>Cancelar</button>
          </>
        )
      case 'PAID':
        return (
          <>
            <button className="btn-outline" onClick={() => onViewDetail(order)}>Ver detalle</button>
            <button className="btn-primary" onClick={() => onStatusChange(order.id, 'SHIPPED')}>Despachar</button>
            <button className="btn-danger" onClick={() => onCancel(order.id)}>Cancelar</button>
          </>
        )
      case 'SHIPPED':
        return (
          <>
            <button className="btn-outline" onClick={() => onViewDetail(order)}>Ver detalle</button>
            <button className="btn-success" onClick={() => onStatusChange(order.id, 'DELIVERED')}>Entregar</button>
          </>
        )
      default:
        return <button className="btn-outline" onClick={() => onViewDetail(order)}>Ver detalle</button>
    }
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Ítems</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td><strong>#{order.id}</strong></td>
            <td>{getCustomerName(order.customerId)}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} ud.</td>
            <td>{formatPrice(order.total)}</td>
            <td>{getStatusBadge(order.status)}</td>
            <td>
              <div style={{ display: 'flex', gap: 8 }}>
                {getActions(order)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OrderList