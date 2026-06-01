import { useState, useEffect } from 'react'
import { getAllCustomers, getAddressesByCustomer } from '../../services/customerService'
import { getAllProducts } from '../../services/productService'

function OrderForm({ onCreate, onCancel }) {
  const [customers, setCustomers]               = useState([])
  const [products, setProducts]                 = useState([])
  const [addresses, setAddresses]               = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [customerId, setCustomerId]             = useState('')
  const [addressId, setAddressId]               = useState('')
  const [items, setItems]                       = useState([{ productId: '', quantity: 1 }])
  const [errors, setErrors]                     = useState({})

  useEffect(() => {
    getAllCustomers().then(data => setCustomers(Array.isArray(data) ? data : data.content ?? [])).catch(() => {})
    getAllProducts().then(data => setProducts(Array.isArray(data) ? data : data.content ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!customerId) { setAddresses([]); setAddressId(''); return }
    setLoadingAddresses(true)
    getAddressesByCustomer(customerId)
      .then(data => { setAddresses(Array.isArray(data) ? data : []); setAddressId('') })
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false))
  }, [customerId])

  function validate() {
    const newErrors = {}
    if (!customerId)                              newErrors.customerId = 'Selecciona un cliente'
    if (!addressId)                               newErrors.addressId  = 'Selecciona una dirección'
    if (items.some(i => !i.productId))            newErrors.items      = 'Completa todos los productos'
    if (items.some(i => Number(i.quantity) <= 0)) newErrors.quantity   = 'La cantidad debe ser mayor a 0'
    return newErrors
  }

  function handleAddItem()            { setItems([...items, { productId: '', quantity: 1 }]) }
  function handleRemoveItem(index)    { setItems(items.filter((_, i) => i !== index)) }
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
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setErrors({})
    onCreate({
      customerId: parseInt(customerId),
      addressId:  parseInt(addressId),
      items: items.map(item => ({ productId: parseInt(item.productId), quantity: parseInt(item.quantity) }))
    })
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Nuevo Pedido</h3>
      <div className="form-grid">

        <div>
          <label>Cliente</label>
          <select className="input" value={customerId} onChange={e => { setCustomerId(e.target.value); setAddressId('') }}>
            <option value="">Seleccionar cliente</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
          </select>
          {errors.customerId && <p className="error-text">{errors.customerId}</p>}
        </div>

        <div>
          <label>Dirección</label>
          <select className="input" value={addressId} disabled={!customerId || loadingAddresses} onChange={e => setAddressId(e.target.value)}>
            <option value="">{loadingAddresses ? 'Cargando...' : 'Seleccionar dirección'}</option>
            {addresses.map(a => <option key={a.id} value={a.id}>{a.street}, {a.city}</option>)}
          </select>
          {errors.addressId && <p className="error-text">{errors.addressId}</p>}
          {customerId && !loadingAddresses && addresses.length === 0 && (
            <p style={{ color: '#f59e0b', fontSize: 12, marginTop: 4 }}>Este cliente no tiene direcciones registradas</p>
          )}
        </div>

      </div>

      <div style={{ marginBottom: 14 }}>
        <label className="filter-label" style={{ display: 'block', marginBottom: 8 }}>Productos</label>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select className="input" value={item.productId} style={{ flex: 2 }}
              onChange={e => handleItemChange(index, 'productId', e.target.value)}>
              <option value="">Seleccionar producto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toLocaleString('es-CO')}</option>
              ))}
            </select>
            <input className="input" type="number" min="1" value={item.quantity} style={{ flex: 1 }}
              onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
            {items.length > 1 && (
              <button type="button" className="btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                onClick={() => handleRemoveItem(index)}>✕</button>
            )}
          </div>
        ))}
        {errors.items    && <p className="error-text">{errors.items}</p>}
        {errors.quantity && <p className="error-text">{errors.quantity}</p>}
        <button type="button" className="btn-outline" onClick={handleAddItem}>+ Agregar producto</button>
      </div>

      <p style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: 4 }}>
        Total estimado: <span style={{ color: 'var(--primary)' }}>${calculateTotal().toLocaleString('es-CO')}</span>
      </p>

      <div className="form-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Crear pedido</button>
      </div>
    </form>
  )
}

export default OrderForm