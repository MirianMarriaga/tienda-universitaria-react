import { useEffect, useState } from 'react'

function CustomerForm({
  editingCustomer,
  onCreate,
  onUpdate,
  onCancel
}) {
  const [identificationNumber, setIdentificationNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('ACTIVE')

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingCustomer) {
      setIdentificationNumber(editingCustomer.identificationNumber)
      setFullName(editingCustomer.fullName)
      setEmail(editingCustomer.email)
      setPhone(editingCustomer.phone)
      setStatus(editingCustomer.status)
    } else {
      setIdentificationNumber('')
      setFullName('')
      setEmail('')
      setPhone('')
      setStatus('ACTIVE')
    }

    setErrors({})
  }, [editingCustomer])

  function validate() {
    const newErrors = {}

    if (!identificationNumber.trim()) {
      newErrors.identificationNumber =
        'La identificación es obligatoria'
    }

    if (!fullName.trim()) {
      newErrors.fullName =
        'El nombre es obligatorio'
    }

    if (!email.trim()) {
      newErrors.email =
        'El email es obligatorio'
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email =
        'El email no es válido'
    }

    if (!phone.trim()) {
      newErrors.phone =
        'El teléfono es obligatorio'
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const customerData = {
      identificationNumber,
      fullName,
      email,
      phone,
      status
    }

    if (editingCustomer) {
      onUpdate({
        ...editingCustomer,
        ...customerData
      })
    } else {
      onCreate(customerData)
    }
  }

  return (
    <form
      className="form-container"
      onSubmit={handleSubmit}
    >
      <h3>
        {editingCustomer
          ? 'Editar cliente'
          : 'Nuevo cliente'}
      </h3>

      <div className="form-grid">

        <div>
          <label>Identificación</label>

          <input
            className="input"
            type="text"
            value={identificationNumber}
            onChange={(e) =>
              setIdentificationNumber(e.target.value)
            }
          />

          {errors.identificationNumber && (
            <p className="error-text">
              {errors.identificationNumber}
            </p>
          )}
        </div>

        <div>
          <label>Nombre completo</label>

          <input
            className="input"
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />

          {errors.fullName && (
            <p className="error-text">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {errors.email && (
            <p className="error-text">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label>Teléfono</label>

          <input
            className="input"
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {errors.phone && (
            <p className="error-text">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label>Estado</label>

          <select
            className="input"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>
          </select>
        </div>

      </div>

      <div className="form-actions">

        {editingCustomer && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="btn-primary"
        >
          {editingCustomer
            ? 'Guardar cambios'
            : '+ Nuevo Cliente'}
        </button>

      </div>
    </form>
  )
}

export default CustomerForm