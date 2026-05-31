export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message = errorData?.message || `HTTP ${response.status}: ${response.statusText}`
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}