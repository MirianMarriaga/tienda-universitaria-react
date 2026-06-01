import { useContext, useState } from 'react'

import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'
import Modal from '../Modal'

import { CustomerContext } from '../context/CustomerContext'
import { customerActions } from '../reducers/customerReducer'

function CustomersPage() {

  const { state, dispatch } = useContext(CustomerContext)

  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  function handleCreate(newCustomer) {
    dispatch({
      type: customerActions.ADD_CUSTOMER,
      payload: { id: Date.now(), ...newCustomer }
    })
    setShowForm(false)
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setShowEditModal(true)
  }

  function handleUpdate(updatedCustomer) {
    dispatch({
      type: customerActions.UPDATE_CUSTOMER,
      payload: { ...editingCustomer, ...updatedCustomer }
    })
    setShowEditModal(false)
    setEditingCustomer(null)
  }

  function handleCancelEdit() {
    setShowEditModal(false)
    setEditingCustomer(null)
  }

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Clientes</h2>
          <p>Administración de clientes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar formulario' : '+ Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <CustomerForm
          editingCustomer={null}
          onCreate={handleCreate}
          onCancel={() => setShowForm(false)}
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