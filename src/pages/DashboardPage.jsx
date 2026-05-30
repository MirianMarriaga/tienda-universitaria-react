import { useContext } from 'react'
import { InventoryContext } from '../context/InventoryContext'
import { OrderContext } from '../context/OrderContext'
import { monthlyIncome } from '../data/reports'
import { products } from '../data/products'
import { customers } from '../data/customers'

function DashboardPage() {
  const { state: orderState } = useContext(OrderContext)
  const { state: inventoryState } = useContext(InventoryContext)

  const orders = orderState.orders
  const inventory = inventoryState.inventory

  // Stats
  const activeProducts = products.filter((p) => p.active).length
  const monthOrders = orders.filter((o) => {
    const date = new Date(o.createdAt)
    return date.getMonth() === 4 && date.getFullYear() === 2026
  }).length
  const monthIncome = orders
    .filter((o) => o.status !== 'CANCELLED' && new Date(o.createdAt).getMonth() === 4)
    .reduce((sum, o) => sum + Number(o.total), 0)
  const lowStock = inventory.filter((i) => i.availableStock < i.minimumStock)

  function formatPrice(price) {
    return `$${Number(price).toLocaleString('es-CO')}`
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  function getStatusLabel(status) {
    const labels = {
      CREATED: 'Creado', PAID: 'Pagado',
      SHIPPED: 'Despachado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado'
    }
    return labels[status] || status
  }

  function getStatusClass(status) {
    const classes = {
      CREATED: 'badge-blue', PAID: 'badge-green',
      SHIPPED: 'badge-purple', DELIVERED: 'badge-green', CANCELLED: 'badge-red'
    }
    return classes[status] || 'badge-gray'
  }

  function getCustomerName(customerId) {
    const customer = customers.find((c) => c.id === customerId)
    return customer ? customer.fullName : 'Desconocido'
  }

  function getProductName(productId) {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : 'Desconocido'
  }

  function getProductSku(productId) {
    const product = products.find((p) => p.id === productId)
    return product ? product.sku : '-'
  }

  const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5)
  const maxIncome = Math.max(...monthlyIncome.map((m) => m.totalIncome))
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen general de la tienda institucional · Junio 2026</p>
        </div>
      </div>

      {/* Cards */}
      <div className="dashboard-cards">
        <div className="stat-card">
          <p className="stat-label">Productos activos</p>
          <p className="stat-value">{activeProducts}</p>
          <p className="stat-sub green">+2 este mes</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pedidos del mes</p>
          <p className="stat-value">{monthOrders}</p>
          <p className="stat-sub green">+18% vs. mes anterior</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ingresos del mes</p>
          <p className="stat-value">{formatPrice(monthIncome)}</p>
          <p className="stat-sub green">+12% vs. mes anterior</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Productos con bajo stock</p>
          <p className="stat-value">{lowStock.length}</p>
          <p className="stat-sub red">Requiere atención</p>
        </div>
      </div>

      {/* Tabla + Alertas */}
      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Pedidos recientes</h3>
              <p>Últimos 5 pedidos registrados</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{getCustomerName(order.customerId)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td><span className={`badge ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-panel">
          <h3>Alertas de inventario</h3>
          <p>{lowStock.length} producto(s) por debajo del mínimo</p>
          <div style={{ marginTop: 16 }}>
            {lowStock.map((item) => (
              <div key={item.id} className="alert-item">
                <div>
                  <strong>{getProductName(item.productId)}</strong>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {getProductSku(item.productId)} · Stock {item.availableStock} / min. {item.minimumStock}
                  </p>
                </div>
                <span className="badge badge-red">Crítico</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="dashboard-panel" style={{ marginTop: 24 }}>
        <h3>Ingresos mensuales</h3>
        <p>Últimos 7 meses</p>
        <div className="bar-chart">
          {monthlyIncome.map((m) => {
            const heightPercent = (m.totalIncome / maxIncome) * 100
            return (
              <div key={`${m.year}-${m.month}`} className="bar-col">
                <span className="bar-label">${(m.totalIncome / 1000000).toFixed(1)}M</span>
                <div className="bar" style={{ height: `${heightPercent}%` }} />
                <span className="bar-month">{monthNames[m.month - 1]}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DashboardPage