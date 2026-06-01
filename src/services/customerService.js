const API_URL = `${import.meta.env.VITE_API_URL}/api/customers`

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  if (response.status === 204) return null

  return response.json()
}


export function getCustomers() {
  return requestJson(API_URL)
}

export function createCustomer(data) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function updateCustomer(data) {
  return requestJson(`${API_URL}/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}


export function getCustomerAddresses(customerId) {
  return requestJson(`${API_URL}/${customerId}/addresses`)
}

export function createCustomerAddress(customerId, address) {
  return requestJson(`${API_URL}/${customerId}/addresses`, {
    method: 'POST',
    body: JSON.stringify(address)
  })
}