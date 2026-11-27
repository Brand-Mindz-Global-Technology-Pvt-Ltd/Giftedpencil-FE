import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import logoImg from '../assets/logo-1-transparent.png'
import authBg from '../assets/auth/auth-bg.png'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/api'

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      newErrors.password = 'Please enter your password.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      })

      setStatusMessage({
        type: 'success',
        text: 'Login successful! Redirecting...',
      })

      // Redirect to the originally attempted page or fallback to /profile
      const destination =
        (location.state as { from?: string } | null)?.from || '/profile'
      navigate(destination, { replace: true })
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (Array.isArray(err.errors) && err.errors.length > 0) {
          const fieldMap: { email?: string; password?: string } = {}
          err.errors.forEach((e) => {
            if (e.field === 'email') fieldMap.email = e.message
            if (e.field === 'password') fieldMap.password = e.message
          })
          setErrors(fieldMap)
        }
        setStatusMessage({
          type: 'error',
          text: err.message || 'Invalid email or password.',
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Network connection error. Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleClick = () => {
    setStatusMessage({
      type: 'success',
      text: 'Google Sign-In integration is coming soon.',
    })
  }

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${authBg})` }}
      aria-label="Login to The Gifted Pencil"
    >
      <div className="login-container">
        {/* Left Section: Welcome & Branding Content positioned toward top */}
        <section className="login-welcome-section" aria-label="Welcome">
          {/* Top-Left Logo using transparent PNG asset */}
          <Link
            to="/"
            className="login-logo-link"
            aria-label="The Gifted Pencil Home"
          >
            <img
              src={logoImg}
              alt="The Gifted Pencil"
              className="login-logo-img"
            />
          </Link>

          {/* Heading & Subtitle Wrapper (Moved 20px right on desktop) */}
          <div className="login-welcome-content">
            <div className="login-heading-wrap">
              <h1 className="login-heading">
                <span className="login-heading-line1">Welcome</span>
                <span className="login-heading-line2">
                  <span>Back!</span>
                  <span className="login-heart-flourish-wrap" aria-hidden="true">
                    <svg
                      className="login-heart-flourish"
                      viewBox="0 0 110 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Tilted outline heart with curved swoosh underline tail */}
                      <path
                        d="M 28 35 C 16 25, 6 15, 12 7 C 18 -1, 26 3, 30 11 C 34 3, 42 -1, 48 7 C 54 15, 42 25, 30 35 C 36 39, 50 41, 68 37 C 86 33, 98 35, 108 38"
                        stroke="#ffffff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>
            </div>

            <p className="login-subtitle">
              Continue your journaling journey with The Gifted Pencil.
            </p>
          </div>
        </section>

        {/* Right Section: Login Form Card */}
        <section className="login-form-section" aria-label="Login Form">
          <div className="login-card">
            {/* Top-Right Decorative Corner with Project Primary Color (#7E3540) */}
            <div className="login-card-corner" aria-hidden="true">
              <svg
                viewBox="0 0 120 120"
                className="login-corner-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Curved corner fill using primary project color */}
                <path
                  d="M 16 0 C 42 12, 75 44, 120 86 L 120 0 Z"
                  fill="#7E3540"
                />
                {/* Outline Heart rotated inside corner */}
                <path
                  d="M 88 28 C 84 22, 76 22, 73 27 C 70 32, 76 38, 88 46 C 100 38, 106 32, 103 27 C 100 22, 92 22, 88 28 Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(-15 88 34)"
                />
              </svg>
            </div>

            {/* Form Title */}
            <h2 className="login-card-title">
              Log In to <span className="login-title-italic">Your Account</span>
            </h2>

            {/* Status / Feedback message */}
            {statusMessage && (
              <div
                className={`login-status-banner ${statusMessage.type === 'error' ? 'is-error' : 'is-success'}`}
                role="status"
              >
                {statusMessage.text}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Email Input */}
              <div className="login-input-group">
                <div className={`login-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    placeholder="Email address"
                    className="login-input"
                    autoComplete="email"
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" className="login-field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="login-input-group">
                <div className={`login-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock className="login-input-icon" size={18} aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    placeholder="Password"
                    className="login-input login-input-password"
                    autoComplete="current-password"
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="login-field-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="login-options-row">
                <label className="login-remember-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-checkbox"
                    disabled={isSubmitting}
                  />
                  <span className="login-remember-text">Remember me</span>
                </label>

                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Log In Button: Primary Brand Color (#7E3540) */}
              <button
                type="submit"
                className="login-btn-primary"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Logging In...' : 'Log In'}</span>
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider" aria-hidden="true">
              <span className="login-divider-line" />
              <span className="login-divider-text">or continue with</span>
              <span className="login-divider-line" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="login-btn-google"
            >
              <svg
                className="login-google-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Sign Up Link */}
            <div className="login-bottom-text">
              <span>Don't have an account? </span>
              <Link to="/register" className="login-signup-link">
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
