const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`

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

export async function getOrders() {
  return requestJson(API_URL, { method: 'GET' })
}

export async function getOrderById(id) {
  return requestJson(`${API_URL}/${id}`, { method: 'GET' })
}

export async function createOrder(orderData) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

export async function payOrder(id) {
  return requestJson(`${API_URL}/${id}/pay`, { method: 'PUT' })
}

export async function shipOrder(id) {
  return requestJson(`${API_URL}/${id}/ship`, { method: 'PUT' })
}

export async function deliverOrder(id) {
  return requestJson(`${API_URL}/${id}/deliver`, { method: 'PUT' })
}

export async function cancelOrder(id) {
  return requestJson(`${API_URL}/${id}/cancel`, { method: 'PUT' })
}

export async function filterOrders(params) {
  const query = new URLSearchParams(params).toString()
  return requestJson(`${API_URL}/filter?${query}`, { method: 'GET' })
}