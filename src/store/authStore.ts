import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  token: string | null
  userName: string | null
  login: (name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
   persist(
    (set) => ({
  token: null,
  userName: null,
  login: (name) => {
    set({ token: 'demo-auth-token', userName: name })
  },
  logout: () => {
    set({ token: null, userName: null })
  },
}),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    },
  ),
)
