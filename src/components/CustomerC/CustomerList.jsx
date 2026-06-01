function CustomerList({ customers, loading, error, onEdit, onDetail }) {

  if (loading) return <p className="center-text muted-text">Cargando clientes...</p>
  if (error)   return <p className="center-text error-text">{error}</p>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td style={{ fontWeight: 500, color: 'var(--text-h)' }}>
                {customer.fullName}
              </td>
              <td>
                <span className="mono" style={{ color: 'var(--text-sub)' }}>
                  {customer.identificationNumber}
                </span>
              </td>
              <td style={{ color: 'var(--text-sub)' }}>
                {customer.email}
              </td>
              <td>
                <span className="mono">{customer.phone}</span>
              </td>
              <td>
                <span className={
                  customer.status === 'ACTIVE' || customer.status === 'ACTIVO'
                    ? 'badge badge-green'
                    : 'badge badge-red'
                }>
                  {customer.status === 'ACTIVE' || customer.status === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn-detail" onClick={() => onDetail && onDetail(customer)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Ver
                  </button>
                  <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => onEdit(customer)}>
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && (
        <p className="center-text muted-text">No se encontraron clientes</p>
      )}
    </div>
  )
}

export default CustomerList