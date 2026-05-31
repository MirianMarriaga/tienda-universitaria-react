import { useContext, useState } from 'react'

import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'

import { CustomerContext } from '../context/CustomerContext'
import { customerActions } from '../reducers/customerReducer'

function CustomersPage() {

  const { state, dispatch } = useContext(CustomerContext)

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function handleCreate(newCustomer) {

    dispatch({
      type: customerActions.ADD_CUSTOMER,
      payload: {
        id: Date.now(),
        ...newCustomer
      }
    })

    setShowForm(false)
  }

  function handleUpdate(updatedCustomer) {

    dispatch({
      type: customerActions.UPDATE_CUSTOMER,
      payload: {
        ...editingCustomer,
        ...updatedCustomer
      }
    })

    setEditingCustomer(null)
    setShowForm(false)
  }

  function handleEdit(customer) {

    setEditingCustomer(customer)
    setShowForm(true)
  }

  function handleCancel() {

    setEditingCustomer(null)
    setShowForm(false)
  }

  function handleToggleForm() {

    if (showForm) {
      setEditingCustomer(null)
      setShowForm(false)
      return
    }

    setEditingCustomer(null)
    setShowForm(true)
  }

  return (
    <section>

      <div className="page-header">

        <div>
          <h2>Clientes</h2>
          <p>Administración de clientes</p>
        </div>

        <button
          className="btn-primary"
          onClick={handleToggleForm}
        >
          {showForm
            ? 'Cerrar formulario'
            : '+ Nuevo Cliente'}
        </button>

      </div>

      {showForm && (
        <CustomerForm
          editingCustomer={editingCustomer}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      <CustomerList
        customers={state.customers}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
      />

    </section>
  )
}

export default CustomersPage