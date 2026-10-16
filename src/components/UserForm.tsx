import { useState, type FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import { roles, statuses, type User, type UserInput } from '../types'
import { errorMessage, validateUser } from '../lib/validation'
import { userService } from '../services'
import { Dialog } from './Dialog'
export function UserForm({
  user,
  onClose,
  onSaved,
}: {
  user?: User
  onClose: () => void
  onSaved: (user: User) => void
}) {
  const [values, setValues] = useState<UserInput>(
    user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      : { name: '', email: '', role: 'Member', status: 'Active' },
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserInput, string>>
  >({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    const validation = validateUser(values)
    setErrors(validation)
    setError('')
    if (Object.keys(validation).length) return
    setBusy(true)
    try {
      onSaved(
        user
          ? await userService.update(user.id, values)
          : await userService.create(values),
      )
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusy(false)
    }
  }
  function change<K extends keyof UserInput>(field: K, value: UserInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setError('')
  }
  return (
    <Dialog
      title={user ? 'Edit user' : 'Add a new user'}
      description={
        user
          ? 'Update their profile and workspace access.'
          : 'Create a profile for someone in your workspace.'
      }
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} noValidate>
        <div className="dialog-body form-stack">
          {error && (
            <p className="error-banner" role="alert">
              {error}
            </p>
          )}
          <div className="field">
            <label htmlFor="user-name">
              Full name <span>*</span>
            </label>
            <input
              data-autofocus
              id="user-name"
              autoComplete="name"
              maxLength={80}
              value={values.name}
              onChange={(event) => change('name', event.target.value)}
              placeholder="e.g. Jamie Taylor"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={busy}
            />
            {errors.name && (
              <small id="name-error" className="field-error">
                {errors.name}
              </small>
            )}
          </div>
          <div className="field">
            <label htmlFor="user-email">
              Email address <span>*</span>
            </label>
            <input
              id="user-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={(event) => change('email', event.target.value)}
              placeholder="jamie@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={busy}
            />
            {errors.email && (
              <small id="email-error" className="field-error">
                {errors.email}
              </small>
            )}
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="user-role">Role</label>
              <select
                id="user-role"
                value={values.role}
                onChange={(event) =>
                  change('role', event.target.value as UserInput['role'])
                }
                disabled={busy}
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="user-status">Status</label>
              <select
                id="user-status"
                value={values.status}
                onChange={(event) =>
                  change('status', event.target.value as UserInput['status'])
                }
                disabled={busy}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="form-note">
            Roles and status are profile attributes in this demo. Setting
            “Invited” does not send an email.
          </p>
        </div>
        <div className="dialog-footer">
          <button
            type="button"
            className="button secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button className="button primary" disabled={busy}>
            {busy && <LoaderCircle size={16} className="spin" />}
            {busy ? 'Saving…' : user ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
