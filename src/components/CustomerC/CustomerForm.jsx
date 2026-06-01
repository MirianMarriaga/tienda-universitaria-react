import { useEffect, useState } from 'react'

function CustomerForm({ editingCustomer, onCreate, onUpdate, onCancel }) {

  const [identificationNumber, setIdentificationNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [errors, setErrors] = useState({})

  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [country, setCountry] = useState('Colombia')

  useEffect(() => {
    if (editingCustomer) {
      setIdentificationNumber(editingCustomer.identificationNumber)
      setFullName(editingCustomer.fullName)
      setEmail(editingCustomer.email)
      setPhone(editingCustomer.phone)
      setStatus(editingCustomer.status)
      loadAddresses(editingCustomer.id)
    } else {
      setIdentificationNumber('')
      setFullName('')
      setEmail('')
      setPhone('')
      setStatus('ACTIVE')
    }
    setErrors({})
  }, [editingCustomer])

  async function loadAddresses(customerId) {
    try {
      setLoadingAddresses(true)
      const res = await fetch(`/api/customers/${customerId}/addresses`)
      const data = await res.json()
      setAddresses(data)
    } catch (e) {
      console.error('Error cargando direcciones', e)
    } finally {
      setLoadingAddresses(false)
    }
  }

  async function handleAddAddress(e) {
    e.preventDefault()
    if (!street.trim() || !city.trim() || !addressState.trim()) return

    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: editingCustomer.id,
          street,
          city,
          state: addressState,
          country
        })
      })
      const newAddress = await res.json()
      setAddresses(prev => [...prev, newAddress])
      setStreet('')
      setCity('')
      setAddressState('')
      setCountry('Colombia')
      setShowAddressForm(false)
    } catch (e) {
      console.error('Error creando dirección', e)
    }
  }

  function validate() {
    const newErrors = {}
    if (!identificationNumber.trim()) newErrors.identificationNumber = 'La identificación es obligatoria'
    if (!fullName.trim()) newErrors.fullName = 'El nombre es obligatorio'
    if (!email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'El email no es válido'
    if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    const customerData = { identificationNumber, fullName, email, phone, status }

    if (editingCustomer) {
      onUpdate({ ...editingCustomer, ...customerData })
    } else {
      onCreate(customerData)
    }
  }

  if (editingCustomer) {
    return (
      <form onSubmit={handleSubmit}>

        <div className="detail-grid">

          <div className="detail-field">
            <p className="detail-label">Correo</p>
            <input
              className="detail-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">Teléfono</p>
            <input
              className="detail-input mono"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">Documento</p>
            <input
              className="detail-input mono"
              type="text"
              value={identificationNumber}
              onChange={e => setIdentificationNumber(e.target.value)}
            />
            {errors.identificationNumber && <p className="error-text">{errors.identificationNumber}</p>}
          </div>

          <div className="detail-field">
            <p className="detail-label">Estado</p>
            <select
              className="detail-input"
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ color: status === 'ACTIVE' ? '#065f46' : '#991b1b', fontWeight: 500, cursor: 'pointer' }}
            >
              <option value="ACTIVE">● Activo</option>
              <option value="INACTIVE">● Inactivo</option>
            </select>
          </div>

        </div>

        <div className="addresses-section">

          <div className="addresses-header">
            <h4>Direcciones registradas</h4>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowAddressForm(v => !v)}
            >
              {showAddressForm ? 'Cancelar' : '+ Agregar Dirección'}
            </button>
          </div>

          {showAddressForm && (
            <div className="address-form">
              <h5>Nueva dirección</h5>
              <div className="form-grid">
                <div>
                  <label>Calle</label>
                  <input
                    className="input"
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                  />
                </div>
                <div>
                  <label>Ciudad</label>
                  <input
                    className="input"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label>Departamento</label>
                  <input
                    className="input"
                    type="text"
                    value={addressState}
                    onChange={e => setAddressState(e.target.value)}
                  />
                </div>
                <div>
                  <label>País</label>
                  <input
                    className="input"
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-primary" onClick={handleAddAddress}>
                  Guardar dirección
                </button>
              </div>
            </div>
          )}

        
          {loadingAddresses && <p className="center-text muted-text">Cargando direcciones...</p>}

          {!loadingAddresses && addresses.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🗺️</div>
              <strong>Sin direcciones</strong>
              <p>Este cliente aún no tiene direcciones registradas.</p>
            </div>
          )}

          {!loadingAddresses && addresses.map(addr => (
            <div key={addr.id} className="address-card">
              {addr.street}, {addr.city}, {addr.state} — {addr.country}
            </div>
          ))}

        </div>

      
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #f0f1f3', marginTop: 20 }}>
          <button type="button" className="btn-outline" onClick={onCancel}>Cerrar</button>
          <button type="submit" className="btn-primary">Guardar cambios</button>
        </div>

      </form>
    )
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>

      <h3>Nuevo cliente</h3>

      <div className="form-grid">

        <div>
          <label>Identificación</label>
          <input
            className="input"
            type="text"
            value={identificationNumber}
            onChange={e => setIdentificationNumber(e.target.value)}
          />
          {errors.identificationNumber && <p className="error-text">{errors.identificationNumber}</p>}
        </div>

        <div>
          <label>Nombre completo</label>
          <input
            className="input"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label>Teléfono</label>
          <input
            className="input"
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div>
          <label>Estado</label>
          <select
            className="input"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">+ Nuevo Cliente</button>
      </div>

    </form>
  )
}

export default CustomerForm