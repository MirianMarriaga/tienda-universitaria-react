import { useState, useEffect } from 'react'

const CustomerForm = ({ editingCustomer, onCreate, onUpdate, onCancel }) => {

  const [form, setForm] = useState({
    identificationNumber: '',
    fullName: '',
    email: '',
    phone: '',
    status: 'ACTIVE'
  })

  const [errors, setErrors] = useState({})

  // Cuando llega un cliente a editar, llena el formulario
  useEffect(() => {
    if (editingCustomer) {
      setForm({
        identificationNumber: editingCustomer.identificationNumber || '',
        fullName: editingCustomer.fullName || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || '',
        status: editingCustomer.status || 'ACTIVE'
      })
    } else {
      setForm({
        identificationNumber: '',
        fullName: '',
        email: '',
        phone: '',
        status: 'ACTIVE'
      })
    }
    setErrors({})
  }, [editingCustomer])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (editingCustomer) {
      await onUpdate({
        id: editingCustomer.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        status: form.status
      })
    } else {
      await onCreate({
        identificationNumber: form.identificationNumber,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        status: form.status
      })
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
            <input
              name="identificationNumber"
              value={form.identificationNumber}
              onChange={handleChange}
              className={`w-full border rounded p-2 ${
                errors.identificationNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.identificationNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.identificationNumber}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {editingCustomer ? 'Update' : 'Create'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CustomerForm