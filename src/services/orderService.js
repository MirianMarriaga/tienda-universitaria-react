import { requestJson } from './apiClient'

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`

export async function getOrders() {
  return requestJson(API_URL)
}

export async function getOrderById(id) {
  return requestJson(`${API_URL}/${id}`)
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