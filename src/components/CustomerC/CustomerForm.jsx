import { useState, useEffect } from 'react'
import { getAddressesByCustomer, createAddress } from '../../services/customerService'

const emptyAddress = { street: '', city: '', state: '', country: '' }

const CustomerForm = ({ editingCustomer, onCreate, onUpdate, onCancel }) => {

  const [form, setForm] = useState({
    identificationNumber: '',
    fullName: '',
    email: '',
    phone: '',
    status: 'ACTIVE'
  })
  const [errors, setErrors] = useState({})

  // direcciones
  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState(emptyAddress)
  const [addressErrors, setAddressErrors] = useState({})
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        identificationNumber: editingCustomer.identificationNumber || '',
        fullName: editingCustomer.fullName || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || '',
        status: editingCustomer.status || 'ACTIVE'
      })
      // carga las direcciones del cliente
      getAddressesByCustomer(editingCustomer.id)
        .then(data => setAddresses(Array.isArray(data) ? data : []))
        .catch(() => setAddresses([]))
    } else {
      setForm({ identificationNumber: '', fullName: '', email: '', phone: '', status: 'ACTIVE' })
      setAddresses([])
    }
    setErrors({})
    setNewAddress(emptyAddress)
    setShowAddressForm(false)
  }, [editingCustomer])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddressChange = (e) => {
    setNewAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!editingCustomer && !form.identificationNumber.trim())
      newErrors.identificationNumber = 'ID Number is required'
    if (!form.fullName.trim())
      newErrors.fullName = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email is not valid'
    if (!form.phone.trim())
      newErrors.phone = 'Phone is required'
    return newErrors
  }

  const validateAddress = () => {
    const errs = {}
    if (!newAddress.street.trim()) errs.street = 'Street is required'
    if (!newAddress.city.trim())   errs.city   = 'City is required'
    if (!newAddress.state.trim())  errs.state  = 'State is required'
    if (!newAddress.country.trim()) errs.country = 'Country is required'
    return errs
  }

  const handleAddAddress = async () => {
    const errs = validateAddress()
    if (Object.keys(errs).length > 0) { setAddressErrors(errs); return }
    setSavingAddress(true)
    try {
      const created = await createAddress(editingCustomer.id, newAddress)
      setAddresses(prev => [...prev, created])
      setNewAddress(emptyAddress)
      setAddressErrors({})
      setShowAddressForm(false)
    } catch (err) {
      setAddressErrors({ general: err.message })
    } finally {
      setSavingAddress(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    if (editingCustomer) {
      await onUpdate({ id: editingCustomer.id, fullName: form.fullName, email: form.email, phone: form.phone, status: form.status })
    } else {
      await onCreate({ identificationNumber: form.identificationNumber, fullName: form.fullName, email: form.email, phone: form.phone, status: form.status })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-4">
        {editingCustomer ? 'Edit Customer' : 'New Customer'}
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {!editingCustomer && (
          <div>
            <label className="block text-sm font-medium mb-1">ID Number</label>
            <input name="identificationNumber" value={form.identificationNumber} onChange={handleChange}
              className={`w-full border rounded p-2 ${errors.identificationNumber ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.identificationNumber && <p className="text-red-500 text-sm mt-1">{errors.identificationNumber}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

      </div>

      {/* ── Sección de direcciones (solo al editar) ── */}
      {editingCustomer && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Direcciones</h3>
            <button type="button" onClick={() => setShowAddressForm(v => !v)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              {showAddressForm ? 'Cancelar' : '+ Agregar dirección'}
            </button>
          </div>

          {/* lista de direcciones existentes */}
          {addresses.length > 0 ? (
            <ul className="mb-3 space-y-1">
              {addresses.map((a, i) => (
                <li key={a.id ?? i} className="text-sm bg-gray-50 border border-gray-200 rounded p-2">
                  {a.street}, {a.city}, {a.state}, {a.country}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 mb-3">No hay direcciones registradas</p>
          )}

          {/* formulario nueva dirección */}
          {showAddressForm && (
            <div className="border border-gray-200 rounded p-3 bg-gray-50 grid grid-cols-2 gap-3">
              {addressErrors.general && <p className="col-span-2 text-red-500 text-sm">{addressErrors.general}</p>}

              {[
                { name: 'street',  label: 'Street' },
                { name: 'city',    label: 'City' },
                { name: 'state',   label: 'State' },
                { name: 'country', label: 'Country' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input name={name} value={newAddress[name]} onChange={handleAddressChange}
                    className={`w-full border rounded p-2 text-sm ${addressErrors[name] ? 'border-red-500' : 'border-gray-300'}`} />
                  {addressErrors[name] && <p className="text-red-500 text-xs mt-1">{addressErrors[name]}</p>}
                </div>
              ))}

              <div className="col-span-2">
                <button type="button" onClick={handleAddAddress} disabled={savingAddress}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
                  {savingAddress ? 'Guardando...' : 'Guardar dirección'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {editingCustomer ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CustomerForm