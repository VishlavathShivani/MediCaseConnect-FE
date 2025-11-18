import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  
  userRole: null,
  user: null,
  
  setUser: (clerkUser) => set({ 
    user: clerkUser,
    userRole: clerkUser?.publicMetadata?.role || null
  }),
  
  clearUser: () => set({ user: null, userRole: null }),
  
  isAdmin: () => get().userRole === 'admin',
  isClinician: () => get().userRole === 'clinician'

}))

export default useAuthStore

