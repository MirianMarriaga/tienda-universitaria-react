import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}/products`, getAuthHeaders())
  return response.data
}

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`, getAuthHeaders())
  return response.data
}

export const createProduct = async (product) => {
  const response = await axios.post(`${API_URL}/products`, product, getAuthHeaders())
  return response.data
}

export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}/products/${id}`, product, getAuthHeaders())
  return response.data
}

export const updateInventory = async (id, inventory) => {
  const response = await axios.put(
    `${API_URL}/products/${id}/inventory`,
    inventory,
    getAuthHeaders()
  )
  return response.data
}