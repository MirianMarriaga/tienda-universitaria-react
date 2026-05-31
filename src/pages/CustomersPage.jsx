import { useState } from 'react'
import CustomerForm from '../components/CustomerC/CustomerForm'
import CustomerList from '../components/CustomerC/CustomerList'
import { useCustomers } from '../context/CustomerContext'

const CustomersPage = () => {

  const [showForm, setShowForm] = useState(false)

  const { selected, clearSelected } = useCustomers()

  const handleNewCustomer = () => {

    if (showForm) {
      setShowForm(false)
      clearSelected()
      return
    }

    clearSelected()
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
          onClick={handleNewCustomer}
        >
          {showForm ? 'Cerrar formulario' : '+ Nuevo Cliente'}
        </button>
      </div>

      {(showForm || selected) && (
        <CustomerForm />
      )}

      <CustomerList />
    </section>
  )
}

export default CustomersPage