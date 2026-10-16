import { roles, statuses, type UserInput } from '../types'
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export function validateUser(input: UserInput) {
  const errors: Partial<Record<keyof UserInput, string>> = {}
  if (input.name.trim().length < 2)
    errors.name = 'Enter a name with at least 2 characters.'
  if (input.name.trim().length > 80)
    errors.name = 'Keep the name under 80 characters.'
  if (!isEmail(input.email.trim()) || input.email.length > 254)
    errors.email = 'Enter a valid email address.'
  if (!roles.includes(input.role)) errors.role = 'Select a valid role.'
  if (!statuses.includes(input.status)) errors.status = 'Select a valid status.'
  return errors
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.'
}
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
