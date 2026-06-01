import { requestJson } from './apiClient'

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`

export async function getAllProducts() {
  return requestJson(API_URL)
}

export async function getProductById(id) {
  return requestJson(`${API_URL}/${id}`)
}

export async function createProduct(product) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(product)
  })
}

export async function updateProduct(id, product) {
  const { categoryId, sku, createdAt, updatedAt, id: _id, ...rest } = product
  return requestJson(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      category: categoryId,   
      name:        rest.name,
      description: rest.description,
      price:       rest.price,
      active:      rest.active
    })
  })
}

export async function updateInventory(id, inventory) {
  return requestJson(`${API_URL}/${id}/inventory`, {
    method: 'PUT',
    body: JSON.stringify(inventory)
  })
}