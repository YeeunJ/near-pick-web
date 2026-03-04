import { create } from 'zustand'
import type { LoginResult, UserRole } from '@/types/api'

interface AuthState {
  accessToken: string | null
  userId: number | null
  role: UserRole | null
  login: (result: LoginResult) => void
  logout: () => void
  isAuthenticated: () => boolean
  init: () => void
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}`
}

function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  userId: null,
  role: null,

  login(result: LoginResult) {
    set({ accessToken: result.accessToken, userId: result.userId, role: result.role })
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('userId', String(result.userId))
    localStorage.setItem('role', result.role)
    setCookie('token', result.accessToken)
    setCookie('role', result.role)
  },

  logout() {
    set({ accessToken: null, userId: null, role: null })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    removeCookie('token')
    removeCookie('role')
    window.location.href = '/login'
  },

  isAuthenticated() {
    return get().accessToken !== null
  },

  init() {
    const accessToken = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    const role = localStorage.getItem('role') as UserRole | null
    if (accessToken && userId && role) {
      set({ accessToken, userId: Number(userId), role })
    }
  },
}))
