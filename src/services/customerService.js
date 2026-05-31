import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getAllCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers`, getAuthHeaders())
  return response.data
}

export const getCustomerById = async (id) => {
  const response = await axios.get(`${API_URL}/customers/${id}`, getAuthHeaders())
  return response.data
}

export const createCustomer = async (customer) => {
  const response = await axios.post(`${API_URL}/customers`, customer, getAuthHeaders())
  return response.data
}

export const updateCustomer = async (id, customer) => {
  const response = await axios.put(`${API_URL}/customers/${id}`, customer, getAuthHeaders())
  return response.data
}

export const getAddressesByCustomer = async (customerId) => {
  const response = await axios.get(
    `${API_URL}/customers/${customerId}/addresses`,
    getAuthHeaders()
  )
  return response.data
}

export const createAddress = async (customerId, address) => {
  const response = await axios.post(
    `${API_URL}/customers/${customerId}/addresses`,
    address,
    getAuthHeaders()
  )
  return response.data
}