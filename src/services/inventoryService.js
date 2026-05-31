const API_URL = `${import.meta.env.VITE_API_URL}/api/products`

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export async function updateInventory(productId, inventoryData) {
  return requestJson(`${API_URL}/${productId}/inventory`, {
    method: 'PUT',
    body: JSON.stringify(inventoryData)
  })
}