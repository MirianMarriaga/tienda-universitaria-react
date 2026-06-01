const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
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

export async function getBestSellingProducts() {
  const end   = new Date().toISOString()
  const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  return requestJson(`${API_URL}/best-selling-products?start=${start}&end=${end}`)
}

export async function getMonthlyIncome() {
  return requestJson(`${API_URL}/monthly-income`)
}

export async function getTopCustomers() {
  return requestJson(`${API_URL}/top-customers`)
}

export async function getLowStockProducts() {
  return requestJson(`${API_URL}/low-stock-products`)
}

export async function getTopCategories() {
  return requestJson(`${API_URL}/top-categories`)
}