const ProductList = ({ products, categories, loading, error, onEdit }) => {

  if (loading) return <p className="text-center">Loading products...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>

  const getCategoryName = (categoryId) => {
    const cat = categories?.find(c => c.id === categoryId)
    return cat ? cat.name : categoryId
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">SKU</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Active</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{product.sku}</td>
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">{getCategoryName(product.categoryId)}</td>
              <td className="border border-gray-300 p-2">${product.price?.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{product.active ? '✅' : '❌'}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => onEdit(product)}  // ← esto faltaba
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No products found</p>
      )}
    </div>
  )
}

export default ProductList