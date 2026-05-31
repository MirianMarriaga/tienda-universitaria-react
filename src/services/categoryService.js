const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`
import { requestJson } from './apiClient'


export async function getCategories() {
  return requestJson(API_URL, { method: 'GET' })
}

export async function createCategory(categoryData) {
  return requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify(categoryData)
  })
}