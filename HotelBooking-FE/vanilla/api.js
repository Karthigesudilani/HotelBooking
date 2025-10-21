const API_BASE = 'http://127.0.0.1:8001/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('hb_token') || ''
  }

  setToken(token) {
    this.token = token || ''
    if (token) {
      localStorage.setItem('hb_token', token)
    } else {
      localStorage.removeItem('hb_token')
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  // Room endpoints
  async searchRooms(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/rooms/search${query ? `?${query}` : ''}`)
  }

  // Booking endpoints
  async getBookings() {
    return this.request('/bookings')
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
  }

  async cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'POST'
    })
  }
}

const apiService = new ApiService()
export default apiService
