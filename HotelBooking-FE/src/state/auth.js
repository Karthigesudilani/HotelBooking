import { reactive, computed } from 'vue'
import apiService from '../services/api.js'

const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('hb_token') : null

const state = reactive({
  token: savedToken || '',
  user: null,
  loading: false
})

export const isLoggedIn = computed(() => !!state.token)
export const currentUser = computed(() => state.user)
export const isLoading = computed(() => state.loading)

export function setToken(newToken) {
  state.token = newToken || ''
  apiService.setToken(newToken)
  if (typeof localStorage !== 'undefined') {
    if (state.token) localStorage.setItem('hb_token', state.token)
    else localStorage.removeItem('hb_token')
  }
}

export function setUser(user) {
  state.user = user
}

export async function login(email, password) {
  state.loading = true
  try {
    const response = await apiService.login(email, password)
    setToken(response.token)
    setUser(response.user)
    return response
  } finally {
    state.loading = false
  }
}

export async function register(name, email, password) {
  state.loading = true
  try {
    const response = await apiService.register(name, email, password)
    setToken(response.token)
    setUser(response.user)
    return response
  } finally {
    state.loading = false
  }
}

export async function logout() {
  try {
    await apiService.logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    setToken('')
    setUser(null)
  }
}

export async function loadUser() {
  if (!state.token) return
  try {
    const user = await apiService.getMe()
    setUser(user)
  } catch (error) {
    console.error('Failed to load user:', error)
    setToken('')
    setUser(null)
  }
}

export function getToken() {
  return state.token
}

export default state


