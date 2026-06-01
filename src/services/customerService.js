import { requestJson } from './apiClient'

const API_URL = `${import.meta.env.VITE_API_URL}/api/customers`

export async function getCustomers() {
  const data = await requestJson(API_URL)
  return Array.isArray(data) ? data : data.content ?? []
}

export const getAllCustomers = getCustomers

export async function getCustomerById(id) {
  return requestJson(`${API_URL}/${id}`)
}

export async function createCustomer(customer) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(customer)
  })
}

export async function updateCustomer(id, customer) {
  await requestJson(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  })
  return requestJson(`${API_URL}/${id}`)
}

export async function getAddressesByCustomer(customerId) {
  return requestJson(`${API_URL}/${customerId}/addresses`)
}

export async function createAddress(customerId, address) {
  return requestJson(`${API_URL}/${customerId}/addresses`, {
    method: 'POST',
    body: JSON.stringify(address)
  })
}