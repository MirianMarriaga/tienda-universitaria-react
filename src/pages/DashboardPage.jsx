import { useEffect, useState } from 'react'
import { getOrders } from '../services/orderService'
//import { getLowStockProducts, getMonthlyIncome } from '../services/reportService'
import { customers } from '../data/customers'

function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [monthlyIncomeData, setMonthlyIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  /*
  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const [ordersData, lowStockData, incomeData] = await Promise.all([
        getOrders(),
        getLowStockProducts(),
        getMonthlyIncome()
      ])
      setOrders(ordersData)
      setLowStock(lowStockData)
      setMonthlyIncomeData(incomeData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
    */

  async function loadDashboard() {
  setLoading(true)
  setError('')
  try {
    const data = await getOrders()
    setOrders(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const activeProducts = orders.filter((o) => o.status !== 'CANCELLED').length
  const monthOrders = orders.filter((o) => {
    const date = new Date(o.createdAt)
    return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
  }).length
  const monthIncome = orders
    .filter((o) => o.status !== 'CANCELLED' && new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + Number(o.total), 0)

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

  const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5)
  const maxIncome = Math.max(...monthlyIncomeData.map((m) => m.totalIncome), 1)
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen general de la tienda institucional</p>
        </div>
      </div>

      {loading && <p>Cargando dashboard...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <div className="dashboard-cards">
        <div className="stat-card">
          <p className="stat-label">Pedidos del mes</p>
          <p className="stat-value">{monthOrders}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ingresos del mes</p>
          <p className="stat-value">{formatPrice(monthIncome)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Productos con bajo stock</p>
          <p className="stat-value">{lowStock.length}</p>
          <p className="stat-sub red">Requiere atención</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Pedidos recientes</h3>
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
              <div key={item.productId} className="alert-item">
                <div>
                  <strong>{item.productName}</strong>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    Stock {item.availableStock} / min. {item.minimumStock}
                  </p>
                </div>
                <span className="badge badge-red">Crítico</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-panel" style={{ marginTop: 24 }}>
        <h3>Ingresos mensuales</h3>
        <div className="bar-chart">
          {monthlyIncomeData.map((m) => {
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