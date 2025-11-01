import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type User = {
  id: string 
  name: string 
  email: string 
  avatar?: string 
  createdAt: string
}

type AuthState = {
  user: User | null 
  token: string | null 
  isAuthenticated: boolean 

  login: (user: User, token: string) => void

  logout: () => void

  updateUser: (user: Partial<User>) => void

  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null, 
      isAuthenticated: false,

      login: (user, token) => {
        set({
          user, 
          token, 
          isAuthenticated: true, 
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (updatedUser) => {
        const currentUser = get().user

        if (!currentUser) return

        set({
          user: {
            ...currentUser, 
            ...updatedUser, 
          },
        })
      },

        setToken: (token) => {
        set({ token })
      },
    }),

      {
      name: "raizes-digitais-auth", 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
export const useAuthToken = () => useAuthStore((state) => state.token)
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
