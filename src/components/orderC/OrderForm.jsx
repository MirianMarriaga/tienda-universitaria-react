import { useState, useEffect } from 'react'
import { getAllCustomers, getAddressesByCustomer } from '../../services/customerService'
import { getAllProducts } from '../../services/productService'

function OrderForm({ onCreate, onCancel }) {
  const [customers, setCustomers] = useState([])
  const [products, setProducts]   = useState([])
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [addressId, setAddressId]   = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [error, setError] = useState('')

  useEffect(() => {
    getAllCustomers()
      .then(data => setCustomers(Array.isArray(data) ? data : data.content ?? []))
      .catch(() => {})
    getAllProducts()
      .then(data => setProducts(Array.isArray(data) ? data : data.content ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!customerId) { setAddresses([]); setAddressId(''); return }
    setLoadingAddresses(true)
    getAddressesByCustomer(customerId)
      .then(data => { setAddresses(Array.isArray(data) ? data : []); setAddressId('') })
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false))
  }, [customerId])

  function handleAddItem() {
    setItems([...items, { productId: '', quantity: 1 }])
  }

  function handleRemoveItem(index) {
    setItems(items.filter((_, i) => i !== index))
  }

  function handleItemChange(index, field, value) {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function calculateTotal() {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === parseInt(item.productId))
      return sum + (product ? Number(product.price) * item.quantity : 0)
    }, 0)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!customerId) { setError('Selecciona un cliente'); return }
    if (!addressId)  { setError('Selecciona una dirección'); return }
    if (items.some(i => !i.productId)) { setError('Completa todos los productos'); return }

    onCreate({
      customerId: parseInt(customerId),
      addressId:  parseInt(addressId),
      items: items.map(item => ({
        productId: parseInt(item.productId),
        quantity:  parseInt(item.quantity)
      }))
    })
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Nuevo Pedido</h3>

      {error && <p style={{ color: '#ef4444', marginBottom: 8 }}>{error}</p>}

      <div className="form-group">
        <label>Cliente</label>
        <select value={customerId} onChange={e => { setCustomerId(e.target.value); setAddressId('') }}>
          <option value="">Seleccionar cliente</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dirección</label>
        <select value={addressId} onChange={e => setAddressId(e.target.value)} disabled={!customerId || loadingAddresses}>
          <option value="">
            {loadingAddresses ? 'Cargando...' : 'Seleccionar dirección'}
          </option>
          {addresses.map(a => (
            <option key={a.id} value={a.id}>{a.street}, {a.city}</option>
          ))}
        </select>
        {customerId && !loadingAddresses && addresses.length === 0 && (
          <p style={{ color: '#f59e0b', fontSize: 12, marginTop: 4 }}>
            Este cliente no tiene direcciones registradas
          </p>
        )}
      </div>

      <div className="form-group">
        <label>Productos</label>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select
              value={item.productId}
              onChange={e => handleItemChange(index, 'productId', e.target.value)}
              style={{ flex: 2 }}
            >
              <option value="">Seleccionar producto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${Number(p.price).toLocaleString('es-CO')}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={e => handleItemChange(index, 'quantity', e.target.value)}
              style={{ flex: 1 }}
            />
            {items.length > 1 && (
              <button type="button" className="btn-danger" onClick={() => handleRemoveItem(index)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="btn-outline" onClick={handleAddItem}>+ Agregar producto</button>
      </div>

      <p><strong>Total estimado: ${calculateTotal().toLocaleString('es-CO')}</strong></p>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Crear pedido</button>
      </div>
    </form>
  )
}

export default OrderForm