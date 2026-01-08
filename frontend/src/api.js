import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
}

export const salesAPI = {
  getAll: () => api.get('/sales'),
  getStats: () => api.get('/dashboard/stats'),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
}

export const uploadAPI = {
  categories: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/csv/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  products: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/csv/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  sales: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/csv/sales', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const exportAPI = {
  xlsx: () => api.get('/reports/export.xlsx', { responseType: 'blob' }),
  postmanCollection: () => api.get('/postman/collection', { responseType: 'blob' }),
  productsCsv: () => api.get('/reports/export-products.csv', { responseType: 'blob' }),
  salesCsv: () => api.get('/reports/export-sales.csv', { responseType: 'blob' }),
}

export default api
