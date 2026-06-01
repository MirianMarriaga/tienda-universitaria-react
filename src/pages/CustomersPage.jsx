import { useContext, useState, useEffect } from 'react'
import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'
import Modal from '../Modal'
import { CustomerContext } from '../context/CustomerContext'
import { createCustomer, updateCustomer, getAddressesByCustomer } from '../services/customerService'

const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`
}

function statusLabel(s) {
  return { CREATED:'Creado', PENDING:'Pendiente', DELIVERED:'Entregado', CANCELLED:'Cancelado', PROCESSING:'En proceso' }[s] ?? s
}
function statusClass(s) {
  if (s === 'DELIVERED') return 'badge badge-green'
  if (s === 'CANCELLED') return 'badge badge-red'
  if (s === 'CREATED')   return 'badge badge-blue'
  return 'badge badge-gray'
}

function CustomerDetailContent({ customer, orders, onClose }) {
  const [addresses, setAddresses] = useState([])
  const [loadingAddr, setLoadingAddr] = useState(false)

  useEffect(() => {
    if (!customer) return
    setLoadingAddr(true)
    getAddressesByCustomer(customer.id)
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddr(false))
  }, [customer])

  const customerOrders = orders?.filter(o =>
    o.customerId === customer.id || o.customerName === customer.fullName
  ) ?? []

  return (
    <>
      <div className="modal-info-grid">
        <div className="modal-info-card">
          <p className="modal-info-label">Documento</p>
          <p className="modal-info-value mono">{customer.identificationNumber}</p>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Estado</p>
          <span className={customer.status === 'ACTIVE' || customer.status === 'ACTIVO' ? 'badge badge-green' : 'badge badge-red'}>
            {customer.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Email</p>
          <p className="modal-info-value" style={{ fontSize:'0.82rem', wordBreak:'break-all' }}>{customer.email}</p>
        </div>
        <div className="modal-info-card">
          <p className="modal-info-label">Teléfono</p>
          <p className="modal-info-value mono">{customer.phone}</p>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <p className="modal-section-title">Direcciones registradas</p>
        {loadingAddr && <p className="muted-text" style={{ fontSize:'0.82rem' }}>Cargando...</p>}
        {!loadingAddr && addresses.length === 0 && <p className="muted-text" style={{ fontSize:'0.82rem' }}>Sin direcciones registradas.</p>}
        {!loadingAddr && addresses.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
            {addresses.map(addr => (
              <div key={addr.id} className="modal-info-card" style={{ display:'flex', flexDirection:'column', gap: 3 }}>
                <p style={{ fontWeight:600, fontSize:'0.83rem', color:'var(--text-h)', margin:0 }}>{addr.city}</p>
                <p style={{ fontSize:'0.78rem', color:'var(--text-sub)', margin:0 }}>{addr.street}</p>
                {addr.state && <p style={{ fontSize:'0.75rem', color:'#9ca3af', margin:0 }}>{addr.state}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="modal-section-title">Historial de pedidos</p>
        {customerOrders.length === 0
          ? <p className="muted-text" style={{ fontSize:'0.82rem' }}>Sin pedidos registrados.</p>
          : (
            <div className="table-wrapper">
              <table className="orders-history-table">
                <thead>
                  <tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {customerOrders.map(order => (
                    <tr key={order.id}>
                      <td className="mono" style={{ color:'var(--primary)', fontWeight:600 }}>#{order.id}</td>
                      <td style={{ color:'var(--text-sub)' }}>{formatDate(order.date || order.createdAt)}</td>
                      <td className="mono" style={{ fontWeight:600 }}>${Number(order.total ?? order.totalAmount ?? 0).toLocaleString()}</td>
                      <td><span className={statusClass(order.status)}>{statusLabel(order.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid var(--border-light)', marginTop:16 }}>
        <button className="btn-outline" onClick={onClose}>Cerrar</button>
      </div>
    </>
  )
}

function CustomersPage() {
  const { state, loadCustomers } = useContext(CustomerContext)

  const [showForm, setShowForm]               = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showEditModal, setShowEditModal]     = useState(false)
  const [detailCustomer, setDetailCustomer]   = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [search, setSearch]                  = useState('')
  const [filterStatus, setFilterStatus]      = useState('')
  const [formError, setFormError]            = useState('')  // ← NUEVO

  const filteredCustomers = state.customers.filter((c) => {
    const term = search.toLowerCase()
    const matchSearch =
      c.fullName.toLowerCase().includes(term)              ||
      c.email.toLowerCase().includes(term)                 ||
      c.identificationNumber?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)

    const matchStatus =
      filterStatus === ''         ? true :
      filterStatus === 'active'   ? (c.status === 'ACTIVE' || c.status === 'ACTIVO') :
                                    (c.status === 'INACTIVE' || c.status === 'INACTIVO')

    return matchSearch && matchStatus
  })

  async function handleCreate(customerData) {
    setFormError('')
    try {
      await createCustomer(customerData)
      await loadCustomers()
      setShowForm(false)
    } catch (e) {
      console.error('Error creando cliente:', e)
      setFormError(e?.message ?? 'Error al crear el cliente. Verifica los datos e intenta de nuevo.')
    }
  }

  async function handleUpdate(customerData) {
    const { id, identificationNumber, fullName, email, phone, status } = customerData
    try {
      await updateCustomer(id, { identificationNumber, fullName, email, phone, status })
      await loadCustomers()
      setEditingCustomer(null)
      setShowEditModal(false)
    } catch (e) {
      console.error('Error actualizando cliente:', e)
    }
  }

  function handleEdit(customer) { setEditingCustomer(customer); setShowEditModal(true) }
  function handleDetail(customer) { setDetailCustomer(customer); setShowDetailModal(true) }
  function handleCancelEdit() { setEditingCustomer(null); setShowEditModal(false) }

  const allOrders = state.orders ?? []

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Clientes</h2>
          <p>Administración de clientes</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setFormError('') }}>
          {showForm ? 'Cerrar formulario' : '+ Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <>
          {formError && (
            <p className="error-text" style={{ marginBottom: 8 }}>{formError}</p>
          )}
          <CustomerForm
            editingCustomer={null}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={() => { setShowForm(false); setEditingCustomer(null); setFormError('') }}
          />
        </>
      )}

      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 2 }}>
          <label className="filter-label">Buscar</label>
          <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <span style={{ position:'absolute', left:11, color:'#9ca3af', display:'flex', alignItems:'center', pointerEvents:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: 34 }}
              placeholder="Nombre, email, documento o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className="filter-count">
          {filteredCustomers.length} de {state.customers.length}
        </div>
      </div>

      <CustomerList
        customers={filteredCustomers}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
        onDetail={handleDetail}
      />

      <Modal
        open={showDetailModal}
        title={`Cliente · ${detailCustomer?.fullName ?? ''}`}
        subtitle={`Doc: ${detailCustomer?.identificationNumber ?? ''}`}
        onClose={() => { setShowDetailModal(false); setDetailCustomer(null) }}
      >
        {detailCustomer && (
          <CustomerDetailContent
            customer={detailCustomer}
            orders={allOrders}
            onClose={() => { setShowDetailModal(false); setDetailCustomer(null) }}
          />
        )}
      </Modal>

      <Modal
        open={showEditModal}
        title={`Cliente · ${editingCustomer?.fullName ?? ''}`}
        subtitle="Editar información del cliente"
        onClose={handleCancelEdit}
      >
        {editingCustomer && (
          <CustomerForm
            editingCustomer={editingCustomer}
            onUpdate={handleUpdate}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>
    </section>
  )
}

export default CustomersPage