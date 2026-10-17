import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  token: string | null
  userName: string | null
  setSession: (token: string, userName: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
   persist(
    (set) => ({
  token: null,
  userName: null,
  setSession: (token, userName) => {
    set({ token, userName })
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
