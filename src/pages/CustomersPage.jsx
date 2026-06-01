import { useContext, useState } from 'react'

import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'

import { CustomerContext } from '../context/CustomerContext'

import {
  createCustomer,
  updateCustomer
} from '../services/customerService'

function CustomersPage() {

  const { state, loadCustomers } = useContext(CustomerContext)

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(customerData) {
    await createCustomer(customerData)
    await loadCustomers()
    setShowForm(false)
  }

  async function handleUpdate(customerData) {
  const { id, ...rest } = customerData
  await updateCustomer(id, rest)
  await loadCustomers()
  setEditingCustomer(null)
  setShowForm(false)
}

  function handleEdit(customer) {
    setEditingCustomer(customer)
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
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cerrar formulario' : '+ Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <CustomerForm
          editingCustomer={editingCustomer}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => setShowForm(false)}
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