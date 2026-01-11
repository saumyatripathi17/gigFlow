import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout')
}

// Gig endpoints
export const gigAPI = {
  getAllGigs: (params) => api.get('/gigs', { params }),
  getGigById: (gigId) => api.get(`/gigs/${gigId}`),
  getUserGigs: (params) => api.get('/gigs/user/my-gigs', { params }),
  createGig: (data) => api.post('/gigs', data),
  updateGig: (gigId, data) => api.patch(`/gigs/${gigId}`, data),
  deleteGig: (gigId) => api.delete(`/gigs/${gigId}`)
}

// Bid endpoints
export const bidAPI = {
  submitBid: (data) => api.post('/bids', data),
  getUserBids: (params) => api.get('/bids/user/my-bids', { params }),
  getBidsForGig: (gigId) => api.get(`/bids/${gigId}`),
  hireBid: (bidId) => api.patch(`/bids/${bidId}/hire`),
  withdrawBid: (bidId) => api.delete(`/bids/${bidId}`)
}

export default api
