import { useState } from 'react'
import { addresses } from '../../data/addresses'
import { customers } from '../../data/customers'
import { products } from '../../data/products'

function OrderForm({ onCreate, onCancel }) {
  const [customerId, setCustomerId] = useState('')
  const [addressId, setAddressId] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])

  function getCustomerAddresses() {
    return addresses.filter((a) => a.customerId === parseInt(customerId))
  }

  function handleAddItem() {
    setItems([...items, { productId: '', quantity: 1 }])
  }

  function handleRemoveItem(index) {
    setItems(items.filter((_, i) => i !== index))
  }

  function handleItemChange(index, field, value) {
    setItems(items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  function calculateTotal() {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === parseInt(item.productId))
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!customerId || !addressId || items.some((i) => !i.productId)) return

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === parseInt(item.productId))
      return {
        id: crypto.randomUUID(),
        productId: parseInt(item.productId),
        productName: product.name,
        quantity: parseInt(item.quantity),
        unitPrice: product.price,
        subtotal: product.price * parseInt(item.quantity)
      }
    })

    onCreate({
      customerId: parseInt(customerId),
      addressId: parseInt(addressId),
      status: 'CREATED',
      total: calculateTotal(),
      items: orderItems
    })
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Nuevo Pedido</h3>

      <div className="form-group">
        <label>Cliente</label>
        <select value={customerId} onChange={(e) => { setCustomerId(e.target.value); setAddressId('') }}>
          <option value="">Seleccionar cliente</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dirección</label>
        <select value={addressId} onChange={(e) => setAddressId(e.target.value)} disabled={!customerId}>
          <option value="">Seleccionar dirección</option>
          {getCustomerAddresses().map((a) => (
            <option key={a.id} value={a.id}>{a.street}, {a.city}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Productos</label>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              style={{ flex: 2 }}
            >
              <option value="">Seleccionar producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toLocaleString('es-CO')}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              style={{ flex: 1 }}
            />
            {items.length > 1 && (
              <button type="button" className="btn-danger" onClick={() => handleRemoveItem(index)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="btn-outline" onClick={handleAddItem}>+ Agregar producto</button>
      </div>

      <p><strong>Total: ${calculateTotal().toLocaleString('es-CO')}</strong></p>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Crear pedido</button>
      </div>
    </form>
  )
}

export default OrderForm