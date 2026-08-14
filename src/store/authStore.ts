import { create } from 'zustand'

export interface AuthState {
  token: string | null
  userName: string | null
  login: (name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userName: null,
  login: (name) => {
    set({ token: 'demo-auth-token', userName: name })
  },
  logout: () => {
    set({ token: null, userName: null })
  },
}))
