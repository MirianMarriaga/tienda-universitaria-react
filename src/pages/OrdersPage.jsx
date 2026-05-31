import { useContext, useEffect, useState } from 'react'
import OrderDetailModal from '../components/OrderC/OrderDetailModal'
import OrderForm from '../components/OrderC/OrderForm'
import OrderList from '../components/OrderC/OrderList'
import { InventoryContext } from '../context/InventoryContext'
import { cancelOrder, createOrder, deliverOrder, filterOrders, getOrders, payOrder, shipOrder } from '../services/orderService'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
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

  async function handleCreate(orderData) {
    try {
      const created = await createOrder(orderData)
      setOrders((prev) => [created, ...prev])
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      let updated
      if (newStatus === 'PAID') updated = await payOrder(orderId)
      else if (newStatus === 'SHIPPED') updated = await shipOrder(orderId)
      else if (newStatus === 'DELIVERED') updated = await deliverOrder(orderId)
      setOrders((prev) => prev.map((o) => o.id === orderId ? updated : o))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCancel(orderId) {
    try {
      const updated = await cancelOrder(orderId)
      setOrders((prev) => prev.map((o) => o.id === orderId ? updated : o))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Pedidos</h2>
          <p>Gestión completa de órdenes de compra y su ciclo de vida</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo Pedido
        </button>
      </div>

      {loading && <p>Cargando pedidos...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {showForm && (
        <OrderForm
          onCreate={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <OrderList
        orders={orders}
        onStatusChange={handleStatusChange}
        onCancel={handleCancel}
        onViewDetail={setSelectedOrder}
      />
    </section>
  )
}

export default OrdersPage