const API_URL = `${import.meta.env.VITE_API_URL}/api/products`
import { requestJson } from './apiClient'

export async function getInventoryByProduct(productId) {
  return requestJson(`${API_URL}/${productId}/inventory`)
}

export async function updateInventory(productId, inventoryData) {
  return requestJson(`${API_URL}/${productId}/inventory`, {
    method: 'PUT',
    body: JSON.stringify(inventoryData)
  })
}