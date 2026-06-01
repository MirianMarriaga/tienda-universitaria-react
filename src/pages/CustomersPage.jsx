import { useContext, useState } from 'react'

import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'
import Modal from '../Modal'

import { CustomerContext } from '../context/CustomerContext'

import { createCustomer, updateCustomer } from '../services/customerService'

function CustomersPage() {

  const { state, loadCustomers } = useContext(CustomerContext)

  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

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
    setShowEditModal(false)
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setShowEditModal(true)
  }

  function handleCancelEdit() {
    setEditingCustomer(null)
    setShowEditModal(false)
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
          editingCustomer={null}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => {
            setShowForm(false)
            setEditingCustomer(null)
          }}
        />
      )}

      <CustomerList
        customers={state.customers}
        loading={state.loading}
        error={state.error}
        onEdit={handleEdit}
      />

      <Modal
        open={showEditModal}
        title={`Cliente · ${editingCustomer?.fullName ?? ''}`}
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