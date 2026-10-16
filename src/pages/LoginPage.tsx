import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { useAuth } from '../context/auth'
import { demoCredentials } from '../services/mock'
import { errorMessage, isEmail } from '../lib/validation'
const currentYear = new Date().getFullYear()
export function LoginPage() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  if (session) return <Navigate to="/users" replace />
  async function submit(event: FormEvent) {
    event.preventDefault()
    const validation = {
      email: isEmail(email.trim()) ? '' : 'Enter a valid email address.',
      password:
        password.length >= 8
          ? ''
          : 'Enter a password with at least 8 characters.',
    }
    setErrors(validation)
    setError('')
    if (validation.email || validation.password) return
    setBusy(true)
    try {
      await login(email, password, remember)
      navigate('/users', { replace: true })
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="login-page">
      <section className="login-story">
        <Brand light />
        <div className="story-content">
          <div className="eyebrow">
            <Sparkles size={15} /> A little more connected
          </div>
          <h1>
            Good teams.
            <br />
            Great possibilities.
          </h1>
          <p>
            One place for your people. Bring your team together and make room
            for what’s next.
          </p>
          <div className="story-card">
            <div className="story-avatars">
              {['OR', 'PB', 'LS', 'DC'].map((name, index) => (
                <span className={`avatar avatar-${index}`} key={name}>
                  {name}
                </span>
              ))}
              <span className="avatar story-plus">+</span>
            </div>
            <h3>Your people, in good company.</h3>
            <p>A clear view of your team. A simpler way to manage it.</p>
            <div className="story-check">
              <span>
                <Check size={14} /> Organized
              </span>
              <span>
                <Check size={14} /> Connected
              </span>
              <span>
                <Check size={14} /> Ready to grow
              </span>
            </div>
          </div>
        </div>
        <div className="story-footer">
          <span>Built for the way you work.</span>
          <span>© {currentYear} rewardsIQ</span>
        </div>
        <div className="story-orbit orbit-one" />
        <div className="story-orbit orbit-two" />
      </section>
      <section className="login-panel">
        <div className="mobile-brand">
          <Brand />
        </div>
        <div className="login-form-wrap">
          <span className="section-kicker">Your workspace</span>
          <h2>Welcome back.</h2>
          <p className="login-intro">
            Sign in to keep your team moving forward.
          </p>
          <form className="form-stack login-form" onSubmit={submit} noValidate>
            {error && (
              <p className="error-banner" role="alert">
                {error}
              </p>
            )}
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: '' }))
                  setError('')
                }}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? 'login-email-error' : undefined
                }
                disabled={busy}
              />
              {errors.email && (
                <small id="login-email-error" className="field-error">
                  {errors.email}
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="password-input">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setErrors((current) => ({ ...current, password: '' }))
                    setError('')
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'login-password-error' : undefined
                  }
                  disabled={busy}
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <small id="login-password-error" className="field-error">
                  {errors.password}
                </small>
              )}
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                disabled={busy}
              />
              Keep me signed in
            </label>
            <button className="button primary login-submit" disabled={busy}>
              {busy ? (
                <LoaderCircle size={18} className="spin" />
              ) : (
                <>
                  Sign in <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="demo-box">
            <div>
              <span className="demo-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <strong>Take a look around</strong>
                <p>A demo workspace, ready to explore.</p>
              </div>
            </div>
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => {
                setEmail(demoCredentials.email)
                setPassword(demoCredentials.password)
                setError('')
                setErrors({ email: '', password: '' })
              }}
            >
              Use demo credentials <ArrowRight size={15} />
            </button>
            <small>Demo access only. Changes are saved in this browser.</small>
          </div>
        </div>
        <p className="login-footer">A little clarity. A lot of possibility.</p>
      </section>
    </main>
  )
}
