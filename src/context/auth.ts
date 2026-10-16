import { createContext, useContext } from 'react'
import type { Session } from '../types'
interface AuthContextValue {
  session: Session | null
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => Promise<void>
}
export const AuthContext = createContext<AuthContextValue | null>(null)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
