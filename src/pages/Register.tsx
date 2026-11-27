import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import logoImg from '../assets/logo-1-transparent.png'
import authBg from '../assets/auth/auth-bg.png'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/api'

type GenderOption = 'female' | 'male' | 'prefer_not_to_say'

const Register: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<GenderOption>('female')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    phone?: string
    gender?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const validate = () => {
    const newErrors: {
      name?: string
      email?: string
      phone?: string
      gender?: string
      password?: string
      confirmPassword?: string
    } = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const indianMobileRegex = /^(\+91|91|0)?[6-9]\d{9}$/

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters long.'
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '')
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your mobile number.'
    } else if (!indianMobileRegex.test(cleanPhone)) {
      newErrors.phone =
        'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
    }

    if (!gender) {
      newErrors.gender = 'Please select a gender option.'
    }

    if (!password) {
      newErrors.password = 'Please create a password.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password =
        'Password must contain at least one letter and at least one number.'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please re-enter your password.'
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

    setIsSubmitting(true)

    try {
      const cleanPhone = phone.trim().replace(/[\s-]/g, '')
      const normalizedPhone =
        cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10)

      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizedPhone,
        gender,
        password,
        confirmPassword,
      })

      setStatusMessage({
        type: 'success',
        text: `${result.message || 'Account created successfully!'} Redirecting to login...`,
      })

      setTimeout(() => {
        navigate('/login')
      }, 1800)
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
          text: err.message || 'Registration failed. Please check your details.',
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Unable to connect to registration service. Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleClick = () => {
    setStatusMessage({
      type: 'success',
      text: 'Google Sign-Up integration is coming soon.',
    })
  }

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${authBg})` }}
      aria-label="Create Account on The Gifted Pencil"
    >
      <div className="register-container">
        {/* Left Section: Welcome & Branding Content positioned toward top */}
        <section className="register-welcome-section" aria-label="Welcome">
          {/* Top-Left Logo using authentic transparent project logo asset */}
          <Link
            to="/"
            className="register-logo-link"
            aria-label="The Gifted Pencil Home"
          >
            <img
              src={logoImg}
              alt="The Gifted Pencil"
              className="register-logo-img"
            />
          </Link>

          {/* Heading & Subtitle Wrapper (Moved 20px right on desktop) */}
          <div className="register-welcome-content">
            <div className="register-heading-wrap">
              <h1 className="register-heading">
                <span className="register-heading-line1">Create</span>
                <span className="register-heading-line2">
                  <span>Your Account</span>
                  <span className="register-heart-flourish-wrap" aria-hidden="true">
                    <svg
                      className="register-heart-flourish"
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

            <p className="register-subtitle">
              Begin your mindful journaling journey with The Gifted Pencil.
            </p>
          </div>
        </section>

        {/* Right Section: Register Form Card */}
        <section className="register-form-section" aria-label="Register Form">
          <div className="register-card">
            {/* Top-Right Decorative Corner with Project Primary Color (#7E3540) */}
            <div className="register-card-corner" aria-hidden="true">
              <svg
                viewBox="0 0 120 120"
                className="register-corner-svg"
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
            <h2 className="register-card-title">
              Create <span className="register-title-italic">Your Account</span>
            </h2>
            <p className="register-card-subtitle">
              Join The Gifted Pencil and start your mindful journaling journey.
            </p>

            {/* Status / Feedback message */}
            {statusMessage && (
              <div
                className={`register-status-banner ${statusMessage.type === 'error' ? 'is-error' : 'is-success'}`}
                role="status"
              >
                {statusMessage.text}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="register-form" noValidate>
              {/* 1. Full Name Input */}
              <div className="register-input-group">
                <div className={`register-input-wrapper ${errors.name ? 'has-error' : ''}`}>
                  <User className="register-input-icon" size={17} aria-hidden="true" />
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    placeholder="Full name"
                    className="register-input"
                    autoComplete="name"
                    aria-describedby={errors.name ? 'register-name-error' : undefined}
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && (
                  <p id="register-name-error" className="register-field-error" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 2. Email Address Input */}
              <div className="register-input-group">
                <div className={`register-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail className="register-input-icon" size={17} aria-hidden="true" />
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    placeholder="Email address"
                    className="register-input"
                    autoComplete="email"
                    aria-describedby={errors.email ? 'register-email-error' : undefined}
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p id="register-email-error" className="register-field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 3. Phone Number Input */}
              <div className="register-input-group">
                <div className={`register-input-wrapper ${errors.phone ? 'has-error' : ''}`}>
                  <Phone className="register-input-icon" size={17} aria-hidden="true" />
                  <input
                    type="tel"
                    id="register-phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                    }}
                    placeholder="Phone number"
                    className="register-input"
                    autoComplete="tel"
                    aria-describedby={errors.phone ? 'register-phone-error' : undefined}
                    aria-invalid={!!errors.phone}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p id="register-phone-error" className="register-field-error" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* 4. Gender Selection (Horizontal Pill Radios) */}
              <div className="register-gender-group">
                <span className="register-gender-label">Gender</span>
                <div
                  className="register-gender-options"
                  role="radiogroup"
                  aria-label="Gender"
                >
                  {/* Female */}
                  <label
                    className={`register-gender-pill ${gender === 'female' ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="register-gender-native-radio"
                      disabled={isSubmitting}
                    />
                    <span className="register-gender-radio" aria-hidden="true">
                      {gender === 'female' && <span className="register-gender-radio-dot" />}
                    </span>
                    <span className="register-gender-text">Female</span>
                  </label>

                  {/* Male */}
                  <label
                    className={`register-gender-pill ${gender === 'male' ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="register-gender-native-radio"
                      disabled={isSubmitting}
                    />
                    <span className="register-gender-radio" aria-hidden="true">
                      {gender === 'male' && <span className="register-gender-radio-dot" />}
                    </span>
                    <span className="register-gender-text">Male</span>
                  </label>

                  {/* Prefer not to say */}
                  <label
                    className={`register-gender-pill ${gender === 'prefer_not_to_say' ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="prefer_not_to_say"
                      checked={gender === 'prefer_not_to_say'}
                      onChange={() => setGender('prefer_not_to_say')}
                      className="register-gender-native-radio"
                      disabled={isSubmitting}
                    />
                    <span className="register-gender-radio" aria-hidden="true">
                      {gender === 'prefer_not_to_say' && <span className="register-gender-radio-dot" />}
                    </span>
                    <span className="register-gender-text">Prefer not to say</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="register-field-error" role="alert">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* 5. Password Input */}
              <div className="register-input-group">
                <div className={`register-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock className="register-input-icon" size={17} aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    placeholder="Password (min 8 chars, letter & number)"
                    className="register-input register-input-password"
                    autoComplete="new-password"
                    aria-describedby={errors.password ? 'register-password-error' : undefined}
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff size={17} aria-hidden="true" />
                    ) : (
                      <Eye size={17} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="register-password-error" className="register-field-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 6. Confirm Password Input */}
              <div className="register-input-group">
                <div className={`register-input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <Lock className="register-input-icon" size={17} aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="register-confirm-password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    placeholder="Confirm password"
                    className="register-input register-input-password"
                    autoComplete="new-password"
                    aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-password-toggle"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} aria-hidden="true" />
                    ) : (
                      <Eye size={17} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="register-confirm-error" className="register-field-error" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button: Sign Up -> */}
              <button
                type="submit"
                className="register-btn-primary"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>

            {/* Divider */}
            <div className="register-divider" aria-hidden="true">
              <span className="register-divider-line" />
              <span className="register-divider-text">or continue with</span>
              <span className="register-divider-line" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="register-btn-google"
            >
              <svg
                className="register-google-icon"
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

            {/* Bottom Log In Navigation Link */}
            <div className="register-bottom-text">
              <span>Already have an account? </span>
              <Link to="/login" className="register-login-link">
                Log In
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register
