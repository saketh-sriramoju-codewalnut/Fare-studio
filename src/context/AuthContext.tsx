import { useState, type ReactNode } from 'react'
import type { Session } from '../types'
import { authService } from '../services'
import { AuthContext } from './auth'
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() =>
    authService.getSession(),
  )
  async function login(email: string, password: string, remember: boolean) {
    setSession(await authService.login(email, password, remember))
  }
  async function logout() {
    await authService.logout()
    setSession(null)
  }
  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
