const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`

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

export async function getCategories() {
  return requestJson(API_URL, { method: 'GET' })
}

export async function createCategory(categoryData) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(categoryData)
  })
}