export const roles = ['Admin', 'Manager', 'Member'] as const
export const statuses = ['Active', 'Invited', 'Inactive'] as const
export type Role = (typeof roles)[number]
export type UserStatus = (typeof statuses)[number]
export interface UserInput {
  name: string
  email: string
  role: Role
  status: UserStatus
}
export interface User extends UserInput {
  id: string
  createdAt: string
}
export interface Session {
  name: string
  email: string
}
export interface AuthService {
  login(email: string, password: string, remember: boolean): Promise<Session>
  getSession(): Session | null
  logout(): Promise<void>
}
export interface UserService {
  list(): Promise<User[]>
  create(input: UserInput): Promise<User>
  update(id: string, input: UserInput): Promise<User>
  remove(id: string): Promise<void>
}
