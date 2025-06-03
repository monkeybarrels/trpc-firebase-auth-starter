import { create } from 'zustand'

interface User {
  id: string
  email: string
  role: string
  displayName?: string
}

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user: User) => set({ 
    user, 
    isAuthenticated: true 
  }),
  
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}))