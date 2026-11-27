import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import logoImg from '../assets/logo-1-transparent.png'
import authBg from '../assets/auth/auth-bg.png'
import { authApi, ApiError } from '../services/api'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [devToken, setDevToken] = useState<string | null>(null)

  const validate = () => {
    const newErrors: { email?: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Please enter your registered email address.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)
    setDevToken(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await authApi.forgotPassword(email.trim().toLowerCase())
      setIsSubmitted(true)
      setStatusMessage({
        type: 'success',
        text:
          res.message ||
          'If an account exists with this email address, password reset instructions have been sent.',
      })

      // In local development, the backend returns dev_reset_token for automated or local manual testing
      if (res.dev_reset_token) {
        setDevToken(res.dev_reset_token)
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Failed to process password reset request.',
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
      className="forgot-page"
      style={{ backgroundImage: `url(${authBg})` }}
      aria-label="Forgot Password - The Gifted Pencil"
    >
      <div className="forgot-container">
        {/* Left Section: Branding & Heading Content */}
        <section className="forgot-welcome-section" aria-label="Forgot Password Information">
          {/* Top-Left Logo */}
          <Link
            to="/"
            className="forgot-logo-link"
            aria-label="The Gifted Pencil Home"
          >
            <img
              src={logoImg}
              alt="The Gifted Pencil"
              className="forgot-logo-img"
            />
          </Link>

          {/* Heading & Subtitle Wrapper (Shifted 20px right on desktop) */}
          <div className="forgot-welcome-content">
            <div className="forgot-heading-wrap">
              <h1 className="forgot-heading">
                <span className="forgot-heading-line1">Forgot</span>
                <span className="forgot-heading-line2">
                  <span>Your Password?</span>
                  <span className="forgot-heart-flourish-wrap" aria-hidden="true">
                    <svg
                      className="forgot-heart-flourish"
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

            <p className="forgot-subtitle">
              Don't worry! It happens. Let's help you get back to your mindful journaling journey.
            </p>
          </div>
        </section>

        {/* Right Section: Forgot Password Form Card */}
        <section className="forgot-form-section" aria-label="Password Reset Form">
          <div className="forgot-card">
            {/* Top-Right Decorative Corner with Project Primary Burgundy (#7E3540) */}
            <div className="forgot-card-corner" aria-hidden="true">
              <svg
                viewBox="0 0 120 120"
                className="forgot-corner-svg"
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
            <h2 className="forgot-card-title">
              Reset <span className="forgot-title-italic">Password</span>
            </h2>

            {/* Decorative Heart Flourish Line */}
            <div className="forgot-card-flourish" aria-hidden="true">
              <span className="forgot-flourish-line" />
              <svg
                className="forgot-flourish-heart"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#7E3540"
                  strokeWidth="1.8"
                  fill="none"
                />
              </svg>
              <span className="forgot-flourish-line" />
            </div>

            <p className="forgot-card-subtitle">
              Enter your registered email address and we'll help you reset your password.
            </p>

            {/* Feedback / Status banner */}
            {statusMessage && (
              <div
                className={`forgot-status-banner ${statusMessage.type === 'error' ? 'is-error' : 'is-success'}`}
                role="status"
              >
                {statusMessage.text}
              </div>
            )}

            {/* Dev reset token notification for local developer testing */}
            {devToken && (
              <div
                className="forgot-status-banner is-success"
                style={{ fontSize: '0.82rem', marginTop: '8px' }}
              >
                <span>Dev Token received. </span>
                <Link
                  to={`/reset-password?token=${encodeURIComponent(devToken)}`}
                  style={{ textDecoration: 'underline', fontWeight: 600 }}
                >
                  Click here to Reset Password
                </Link>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="forgot-form" noValidate>
              <div className="forgot-input-group">
                <label htmlFor="forgot-email" className="forgot-input-label">
                  Email Address
                </label>
                <div className={`forgot-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail className="forgot-input-icon" size={18} aria-hidden="true" />
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    placeholder="Enter your registered email address"
                    className="forgot-input"
                    autoComplete="email"
                    aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p id="forgot-email-error" className="forgot-field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button: Send Reset Link -> */}
              <button
                type="submit"
                className="forgot-btn-primary"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : isSubmitted ? 'Resend Reset Link' : 'Send Reset Link'}</span>
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>

            {/* Divider */}
            <div className="forgot-divider" aria-hidden="true">
              <span className="forgot-divider-line" />
            </div>

            {/* Bottom Navigation */}
            <div className="forgot-bottom-links">
              <p className="forgot-bottom-text">
                <span>Remember your password? </span>
                <Link to="/login" className="forgot-link-primary">
                  Log In
                </Link>
              </p>

              <div className="forgot-back-signup-wrap">
                <Link to="/register" className="forgot-link-secondary">
                  Back to Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ForgotPassword
