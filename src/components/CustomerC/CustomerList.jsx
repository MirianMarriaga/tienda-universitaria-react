import { useCustomers } from '../../context/CustomerContext'

const CustomerList = ({ customers, loading, error, onEdit }) => {

  if (loading) return <p className="text-center">Loading customers...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Full Name</th>
            <th className="border border-gray-300 p-2">ID Number</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{customer.fullName}</td>
              <td className="border border-gray-300 p-2">{customer.identificationNumber}</td>
              <td className="border border-gray-300 p-2">{customer.email}</td>
              <td className="border border-gray-300 p-2">{customer.phone}</td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {customer.status}
                </span>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No customers found</p>
      )}
    </div>
  )
}

export default CustomerList