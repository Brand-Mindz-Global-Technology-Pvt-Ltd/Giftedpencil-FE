import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import logoImg from '../assets/logo-1-transparent.png'
import authBg from '../assets/auth/auth-bg.png'
import { authApi, ApiError } from '../services/api'

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    token?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = () => {
    const newErrors: {
      token?: string
      password?: string
      confirmPassword?: string
    } = {}

    const effectiveToken = token.trim() || tokenFromUrl.trim()
    if (!effectiveToken) {
      newErrors.token =
        'Password reset token is missing. Please open the link sent to your email.'
    }

    if (!password) {
      newErrors.password = 'Please enter your new password.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password =
        'Password must contain at least one letter and at least one number.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please re-enter your new password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
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

    const effectiveToken = token.trim() || tokenFromUrl.trim()
    setIsSubmitting(true)

    try {
      const res = await authApi.resetPassword({
        token: effectiveToken,
        password,
        confirmPassword,
      })

      setIsSuccess(true)
      setStatusMessage({
        type: 'success',
        text:
          res.message ||
          'Your password has been updated successfully! Redirecting to login...',
      })

      setTimeout(() => {
        navigate('/login')
      }, 2200)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (Array.isArray(err.errors) && err.errors.length > 0) {
          const fieldMap: Record<string, string> = {}
          err.errors.forEach((e) => {
            fieldMap[e.field] = e.message
          })
          setErrors((prev) => ({ ...prev, ...fieldMap }))
        }
        setStatusMessage({
          type: 'error',
          text:
            err.message ||
            'Password reset failed. The link may have expired or is invalid.',
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Unable to connect to server. Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="reset-page"
      style={{ backgroundImage: `url(${authBg})` }}
      aria-label="Reset Password - The Gifted Pencil"
    >
      <div className="reset-container">
        {/* Left Section: Branding & Heading Content */}
        <section className="reset-welcome-section" aria-label="Reset Password Information">
          {/* Top-Left Logo */}
          <Link
            to="/"
            className="reset-logo-link"
            aria-label="The Gifted Pencil Home"
          >
            <img
              src={logoImg}
              alt="The Gifted Pencil"
              className="reset-logo-img"
            />
          </Link>

          {/* Heading & Subtitle Wrapper (Shifted 20px right on desktop) */}
          <div className="reset-welcome-content">
            <div className="reset-heading-wrap">
              <h1 className="reset-heading">
                <span className="reset-heading-line1">Create</span>
                <span className="reset-heading-line2">
                  <span>New Password</span>
                  <span className="reset-heart-flourish-wrap" aria-hidden="true">
                    <svg
                      className="reset-heart-flourish"
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

            <p className="reset-subtitle">
              You're almost there! Set a new password and continue your mindful journaling journey.
            </p>
          </div>
        </section>

        {/* Right Section: Reset Password Form Card */}
        <section className="reset-form-section" aria-label="Reset Password Form">
          <div className="reset-card">
            {/* Top-Right Decorative Corner with Project Primary Burgundy (#7E3540) */}
            <div className="reset-card-corner" aria-hidden="true">
              <svg
                viewBox="0 0 120 120"
                className="reset-corner-svg"
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

            {/* Form Title & Subtitle */}
            <h2 className="reset-card-title">
              Reset <span className="reset-title-italic">Password</span>
            </h2>

            <p className="reset-card-subtitle">
              Create a strong new password to secure your account.
            </p>

            {/* Feedback / Status banner */}
            {statusMessage && (
              <div
                className={`reset-status-banner ${statusMessage.type === 'error' ? 'is-error' : 'is-success'}`}
                role="status"
              >
                {statusMessage.text}
              </div>
            )}

            {/* If reset token was not detected in URL, provide a field to input or paste token */}
            {!tokenFromUrl && (
              <div className="reset-input-group" style={{ marginBottom: '14px' }}>
                <label htmlFor="reset-token" className="reset-input-label">
                  Reset Token
                </label>
                <div className={`reset-input-wrapper ${errors.token ? 'has-error' : ''}`}>
                  <input
                    type="text"
                    id="reset-token"
                    name="token"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value)
                      if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }))
                    }}
                    placeholder="Enter reset token from your email"
                    className="reset-input"
                    aria-describedby={errors.token ? 'reset-token-error' : undefined}
                    aria-invalid={!!errors.token}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.token && (
                  <p id="reset-token-error" className="reset-field-error" role="alert">
                    {errors.token}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="reset-form" noValidate>
              {/* 1. New Password Input */}
              <div className="reset-input-group">
                <label htmlFor="reset-new-password" className="reset-input-label">
                  New Password
                </label>
                <div className={`reset-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock className="reset-input-icon" size={18} aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="reset-new-password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    placeholder="At least 8 chars, letter & number"
                    className="reset-input reset-input-password"
                    autoComplete="new-password"
                    aria-describedby={errors.password ? 'reset-new-password-error' : undefined}
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="reset-password-toggle"
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
                  <p id="reset-new-password-error" className="reset-field-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 2. Confirm New Password Input */}
              <div className="reset-input-group">
                <label htmlFor="reset-confirm-password" className="reset-input-label">
                  Confirm New Password
                </label>
                <div className={`reset-input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <Lock className="reset-input-icon" size={18} aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="reset-confirm-password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    placeholder="Re-enter your new password"
                    className="reset-input reset-input-password"
                    autoComplete="new-password"
                    aria-describedby={errors.confirmPassword ? 'reset-confirm-password-error' : undefined}
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="reset-password-toggle"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="reset-confirm-password-error" className="reset-field-error" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button: Update Password -> */}
              <button
                type="submit"
                className="reset-btn-primary"
                disabled={isSubmitting || isSuccess}
              >
                <span>
                  {isSubmitting
                    ? 'Updating...'
                    : isSuccess
                      ? 'Password Updated ✓'
                      : 'Update Password'}
                </span>
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>

            {/* Divider */}
            <div className="reset-divider" aria-hidden="true">
              <span className="reset-divider-line" />
            </div>

            {/* Bottom Navigation */}
            <div className="reset-bottom-links">
              <p className="reset-bottom-text">
                <span>Remembered your password? </span>
                <Link to="/login" className="reset-link-primary">
                  Log In
                </Link>
              </p>

              <div className="reset-back-wrap">
                <Link to="/forgot-password" className="reset-link-secondary">
                  Back to Forgot Password
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ResetPassword
