function CustomerList({ customers, loading, error, onEdit }) {

  if (loading) return <p className="center-text">Loading customers...</p>
  if (error)   return <p className="center-text error-text">{error}</p>

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>ID Number</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.identificationNumber}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <span className={customer.status === 'ACTIVE' ? 'badge-success' : 'badge-error'}>
                  {customer.status}
                </span>
              </td>
              <td>
                <button className="btn-primary" onClick={() => onEdit(customer)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <p className="center-text muted-text">No customers found</p>
      )}
    </div>
  )
}

export default CustomerList