import { useContext, useState } from 'react'
import OrderForm from '../components/orderC/OrderForm'
import OrderList from '../components/orderC/OrderList'
import OrderDetailModal from '../components/OrderC/OrderDetailModal'
import { OrderContext } from '../context/OrderContext'
import { orderActions } from '../reducers/orderReducer'

function OrdersPage() {
  const { state, dispatch } = useContext(OrderContext)
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  function handleCreate(newOrder) {
    dispatch({ type: orderActions.ADD_ORDER, payload: newOrder })
    setShowForm(false)
  }

  function handleStatusChange(orderId, newStatus) {
    dispatch({
      type: orderActions.UPDATE_ORDER_STATUS,
      payload: { id: orderId, status: newStatus }
    })
  }

  function handleCancel(orderId) {
    dispatch({
      type: orderActions.CANCEL_ORDER,
      payload: { id: orderId }
    })
  }

  function handleViewDetail(order) {
    setSelectedOrder(order)
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
        orders={state.orders}
        onStatusChange={handleStatusChange}
        onCancel={handleCancel}
        onViewDetail={handleViewDetail}
      />
    </section>
  )
}

export default OrdersPage