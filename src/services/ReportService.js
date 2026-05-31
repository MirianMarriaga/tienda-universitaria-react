import axios from 'axios'

const API_URL = 'http://localhost:8080'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getBestSellingProducts = async () => {
  const response = await axios.get(
    `${API_URL}/reports/best-selling`,
    getAuthHeaders()
  )

  return response.data
}

export const getMonthlyIncome = async () => {
  const response = await axios.get(
    `${API_URL}/reports/monthly-income`,
    getAuthHeaders()
  )

  return response.data
}

export const getTopCustomers = async () => {
  const response = await axios.get(
    `${API_URL}/reports/top-customers`,
    getAuthHeaders()
  )

  return response.data
}

export const getLowStockProducts = async () => {
  const response = await axios.get(
    `${API_URL}/reports/low-stock`,
    getAuthHeaders()
  )

  return response.data
}

export const getTopCategories = async () => {
  const response = await axios.get(
    `${API_URL}/reports/top-categories`,
    getAuthHeaders()
  )

  return response.data
}