import { useContext, useState } from 'react'
import OrderForm from '../components/orderC/OrderForm'
import OrderList from '../components/orderC/OrderList'
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
        <div className="category-form">
          <h3>Detalle del Pedido #{selectedOrder.id}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unitPrice).toLocaleString('es-CO')}</td>
                  <td>${Number(item.subtotal).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Total: ${Number(selectedOrder.total).toLocaleString('es-CO')}</strong></p>
          <button className="btn-outline" onClick={() => setSelectedOrder(null)}>Cerrar</button>
        </div>
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