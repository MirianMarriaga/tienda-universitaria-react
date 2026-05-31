const API_URL =
  `${import.meta.env.VITE_API_URL}/api/customers`

function getAuthHeaders() {
  return {
    Authorization:
      `Bearer ${localStorage.getItem('token')}`
  }
}

async function requestJson(
  url,
  options = {}
) {

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function getAllCustomers() {
  return requestJson(API_URL)
}

export async function getCustomerById(id) {
  return requestJson(
    `${API_URL}/${id}`
  )
}

export async function createCustomer(customer) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(customer)
  })
}

export async function updateCustomer(
  id,
  customer
) {
  return requestJson(
    `${API_URL}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(customer)
    }
  )
}

export async function getAddressesByCustomer(
  customerId
) {
  return requestJson(
    `${API_URL}/${customerId}/addresses`
  )
}

export async function createAddress(
  customerId,
  address
) {
  return requestJson(
    `${API_URL}/${customerId}/addresses`,
    {
      method: 'POST',
      body: JSON.stringify(address)
    }
  )
}