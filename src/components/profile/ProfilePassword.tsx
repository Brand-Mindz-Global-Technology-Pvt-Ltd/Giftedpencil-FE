import React, { useState } from 'react'
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react'
import { profileApi } from '../../services/api'

const ProfilePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      await profileApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to change password. Please check your current password and try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="profile-card profile-password-card">
      <div className="profile-card-header">
        <h2 className="profile-card-title">Change Password</h2>
        <p className="profile-card-subtitle">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>

      {success && (
        <div className="profile-alert-success" role="status">
          <CheckCircle2 size={18} />
          <span>Your password has been changed successfully.</span>
        </div>
      )}

      {error && (
        <div className="profile-alert-error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Current Password */}
        <div className="profile-form-group">
          <label htmlFor="currentPassword" className="profile-form-label">
            Current Password <span className="profile-required">*</span>
          </label>
          <div className="profile-input-wrapper">
            <span className="profile-input-icon" aria-hidden="true">
              <Lock size={18} strokeWidth={1.8} />
            </span>
            <input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              className="profile-text-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className="profile-eye-toggle-btn"
              onClick={() => setShowCurrent((prev) => !prev)}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password Grid */}
        <div className="profile-form-row">
          <div className="profile-form-group">
            <label htmlFor="newPassword" className="profile-form-label">
              New Password <span className="profile-required">*</span>
            </label>
            <div className="profile-input-wrapper">
              <span className="profile-input-icon" aria-hidden="true">
                <Lock size={18} strokeWidth={1.8} />
              </span>
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                className="profile-text-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                className="profile-eye-toggle-btn"
                onClick={() => setShowNew((prev) => !prev)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="profile-form-group">
            <label htmlFor="confirmPassword" className="profile-form-label">
              Confirm New Password <span className="profile-required">*</span>
            </label>
            <div className="profile-input-wrapper">
              <span className="profile-input-icon" aria-hidden="true">
                <Lock size={18} strokeWidth={1.8} />
              </span>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="profile-text-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                className="profile-eye-toggle-btn"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="profile-form-actions">
          <button type="submit" className="profile-save-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="profile-spinner" aria-hidden="true" />
                <span>Updating Password...</span>
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePassword
