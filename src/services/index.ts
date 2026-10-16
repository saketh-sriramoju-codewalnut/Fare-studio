import { mockAuthService, mockUserService } from './mock'
import type { AuthService, UserService } from '../types'
// Replace these adapters when API contracts are available. No network requests are made.
export const authService: AuthService = mockAuthService
export const userService: UserService = mockUserService
