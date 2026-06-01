function OrderList({ orders, customers = [], onStatusChange, onCancel, onViewDetail }) {

  function getCustomerName(customerId) {
    const customer = customers.find(c => c.id === customerId || c.id === Number(customerId))
    return customer ? customer.fullName : `Cliente #${customerId}`
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function formatPrice(price) {
    return `$${Number(price).toLocaleString('es-CO')}`
  }

  function getStatusBadge(status) {
    const styles = { CREATED:'badge-blue', PAID:'badge-green', SHIPPED:'badge-purple', DELIVERED:'badge-green', CANCELLED:'badge-red' }
    const labels = { CREATED:'Creado', PAID:'Pagado', SHIPPED:'Despachado', DELIVERED:'Entregado', CANCELLED:'Cancelado' }
    return <span className={`badge ${styles[status] ?? 'badge-gray'}`}>{labels[status] ?? status}</span>
  }

  function getActions(order) {
    const btnSm = { fontSize: '0.78rem', padding: '6px 12px' }
    switch (order.status) {
      case 'CREATED': return (
        <>
          <button className="btn-detail" onClick={() => onViewDetail(order)}>Ver detalle</button>
          <button className="btn-primary" style={btnSm} onClick={() => onStatusChange(order.id, 'PAID')}>Pagar</button>
          <button className="btn-outline" style={{ ...btnSm, color:'#dc2626', borderColor:'#fca5a5' }} onClick={() => onCancel(order.id)}>Cancelar</button>
        </>
      )
      case 'PAID': return (
        <>
          <button className="btn-detail" onClick={() => onViewDetail(order)}>Ver detalle</button>
          <button className="btn-primary" style={btnSm} onClick={() => onStatusChange(order.id, 'SHIPPED')}>Despachar</button>
          <button className="btn-outline" style={{ ...btnSm, color:'#dc2626', borderColor:'#fca5a5' }} onClick={() => onCancel(order.id)}>Cancelar</button>
        </>
      )
      case 'SHIPPED': return (
        <>
          <button className="btn-detail" onClick={() => onViewDetail(order)}>Ver detalle</button>
          <button className="btn-success" style={btnSm} onClick={() => onStatusChange(order.id, 'DELIVERED')}>✓ Entregar</button>
        </>
      )
      default: return <button className="btn-detail" onClick={() => onViewDetail(order)}>Ver detalle</button>
    }
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Ítems</th><th>Total</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr><td colSpan={7} className="center-text muted-text">No hay pedidos registrados</td></tr>
          )}
          {orders.map(order => (
            <tr key={order.id}>
              <td><strong style={{ color: 'var(--primary)' }}>#{order.id}</strong></td>
              <td style={{ fontWeight: 500 }}>{getCustomerName(order.customerId)}</td>
              <td style={{ color: 'var(--text-sub)' }}>{formatDate(order.createdAt)}</td>
              <td><span className="badge badge-gray">{order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0} ud.</span></td>
              <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(order.total ?? order.totalAmount ?? 0)}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td><div className="table-actions">{getActions(order)}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderList