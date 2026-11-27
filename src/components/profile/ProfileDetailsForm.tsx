import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Mail,
  Phone,
  Camera,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react'
import { profileApi, type BackendUserProfile } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const ProfileDetailsForm: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, refreshUser } = useAuth()

  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [gender, setGender] = useState<'Female' | 'Male' | 'Prefer not to say'>('Prefer not to say')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  // Loading & Error States
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false)

  // Edit mode state
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [tempFullName, setTempFullName] = useState<string>('')
  const [tempEmail, setTempEmail] = useState<string>('')
  const [tempPhone, setTempPhone] = useState<string>('')
  const [tempGender, setTempGender] = useState<'Female' | 'Male' | 'Prefer not to say'>('Prefer not to say')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch authenticated profile from GET /api/profile
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return

    let ignore = false

    const fetchProfile = async () => {
      setIsLoadingProfile(true)
      setProfileError(null)
      try {
        const p: BackendUserProfile = await profileApi.getProfile()
        if (ignore) return

        const resolvedName = p.name || p.full_name || ''
        const resolvedEmail = p.email || ''
        const resolvedPhone = p.phone ? (p.phone.startsWith('+91') ? p.phone : `+91 ${p.phone}`) : ''

        let resolvedGender: 'Female' | 'Male' | 'Prefer not to say' = 'Prefer not to say'
        if (p.gender) {
          const g = p.gender.toLowerCase()
          if (g === 'female') resolvedGender = 'Female'
          else if (g === 'male') resolvedGender = 'Male'
        }

        setFullName(resolvedName)
        setEmail(resolvedEmail)
        setPhone(resolvedPhone)
        setGender(resolvedGender)
        setPhotoUrl(p.avatar_url || null)
      } catch (err: unknown) {
        if (ignore) return
        const msg = err instanceof Error ? err.message : 'Unable to load profile data.'
        setProfileError(msg)
      } finally {
        if (!ignore) {
          setIsLoadingProfile(false)
        }
      }
    }

    fetchProfile()

    return () => {
      ignore = true
    }
  }, [isAuthenticated, isAuthLoading])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoUrl(url)
    }
  }

  const handleStartEdit = () => {
    setProfileError(null)
    setTempFullName(fullName)
    setTempEmail(email)
    setTempPhone(phone.replace(/\+91\s?/, ''))
    setTempGender(gender)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setProfileError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setProfileError(null)

    try {
      const cleanedPhone = tempPhone.trim().replace(/[\s-]/g, '').slice(-10)
      const payload = {
        name: tempFullName.trim(),
        email: tempEmail.trim().toLowerCase(),
        phone: cleanedPhone,
        gender: tempGender === 'Female' ? 'female' : tempGender === 'Male' ? 'male' : 'prefer_not_to_say',
      }

      const updated = await profileApi.updateProfile(payload)

      const resolvedName = updated.name || updated.full_name || tempFullName
      const resolvedEmail = updated.email || tempEmail
      const resolvedPhone = updated.phone ? (updated.phone.startsWith('+91') ? updated.phone : `+91 ${updated.phone}`) : tempPhone

      setFullName(resolvedName)
      setEmail(resolvedEmail)
      setPhone(resolvedPhone)
      setGender(tempGender)
      setIsEditing(false)
      setSavedSuccess(true)

      // Refresh AuthContext user state so Header & other consumers stay synced
      await refreshUser()

      setTimeout(() => setSavedSuccess(false), 3500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.'
      setProfileError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="profile-overview-card" style={{ padding: '60px 20px', textAlign: 'center', color: '#7E3540' }}>
        <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ fontSize: '14.5px', fontWeight: 500 }}>Loading profile details...</p>
      </div>
    )
  }

  return (
    <div className="profile-overview-card">
      {/* Top Profile Header Block */}
      <div className="profile-card-top-row">
        {/* Left: Avatar & Profile Info */}
        <div className="profile-identity-cluster">
          {/* Avatar Container with Camera Badge */}
          <div className="profile-avatar-wrapper">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile Avatar"
                className="profile-avatar-photo"
              />
            ) : (
              <div className="profile-avatar-silhouette" aria-hidden="true">
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  className="profile-silhouette-svg"
                >
                  <circle cx="40" cy="28" r="16" fill="#D38C9B" />
                  <path
                    d="M14 68 C14 50, 26 44, 40 44 C54 44, 66 50, 66 68 Z"
                    fill="#D38C9B"
                  />
                </svg>
              </div>
            )}

            <button
              type="button"
              className="profile-camera-badge"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change profile picture"
            >
              <Camera size={15} strokeWidth={2.2} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>

          {/* Heading and Contact Information */}
          <div className="profile-info-text-wrap">
            <div className="profile-title-row">
              <span className="profile-title-divider" aria-hidden="true" />
              <div className="profile-title-and-subtitle">
                <h1 className="profile-main-title">
                  My <span className="profile-title-italic">Profile</span>
                </h1>
                <p className="profile-main-subtitle">
                  Manage your personal information and keep it up to date.
                </p>
              </div>
            </div>

            <h2 className="profile-user-name">{fullName || 'Valued Customer'}</h2>

            <div className="profile-contact-meta-row">
              <span className="profile-meta-item">
                <Mail size={15} className="profile-meta-icon" aria-hidden="true" />
                <span className="profile-meta-text">{email || 'Not provided'}</span>
              </span>

              {phone && (
                <>
                  <span className="profile-meta-pipe" aria-hidden="true">|</span>
                  <span className="profile-meta-item">
                    <Phone size={15} className="profile-meta-icon" aria-hidden="true" />
                    <span className="profile-meta-text">{phone}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Edit Profile Button */}
        <div className="profile-edit-btn-wrap">
          {!isEditing ? (
            <button
              type="button"
              className="profile-edit-action-btn"
              onClick={handleStartEdit}
            >
              <Pencil size={15} strokeWidth={2} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              type="button"
              className="profile-cancel-action-btn"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <X size={15} strokeWidth={2} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="profile-alert-success" role="status" style={{ marginTop: '16px' }}>
          <CheckCircle2 size={16} />
          <span>Profile details updated successfully.</span>
        </div>
      )}

      {profileError && (
        <div className="profile-alert-error" role="alert" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} color="#DC2626" />
          <span>{profileError}</span>
        </div>
      )}

      {/* Middle: Personal Details Section */}
      <div className="profile-details-section">
        <div className="profile-section-heading-wrap">
          <span className="profile-pink-dash" aria-hidden="true" />
          <h3 className="profile-section-heading">Personal Details</h3>
        </div>

        {!isEditing ? (
          /* Exact 4 Cards from Reference */
          <div className="profile-details-cards-grid">
            {/* Card 1: Full Name */}
            <div className="profile-detail-card">
              <div className="profile-detail-icon-wrap" aria-hidden="true">
                <User size={22} strokeWidth={1.8} />
              </div>
              <span className="profile-detail-label">Full Name</span>
              <span className="profile-detail-value">{fullName || '—'}</span>
            </div>

            {/* Card 2: Email Address */}
            <div className="profile-detail-card">
              <div className="profile-detail-icon-wrap" aria-hidden="true">
                <Mail size={22} strokeWidth={1.8} />
              </div>
              <span className="profile-detail-label">Email Address</span>
              <span className="profile-detail-value">{email || '—'}</span>
            </div>

            {/* Card 3: Phone Number */}
            <div className="profile-detail-card">
              <div className="profile-detail-icon-wrap" aria-hidden="true">
                <Phone size={22} strokeWidth={1.8} />
              </div>
              <span className="profile-detail-label">Phone Number</span>
              <span className="profile-detail-value">{phone || '—'}</span>
            </div>

            {/* Card 4: Gender */}
            <div className="profile-detail-card">
              <div className="profile-detail-icon-wrap" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="profile-gender-svg"
                >
                  <circle cx="12" cy="9" r="6" />
                  <path d="M12 15v7M9 19h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="profile-detail-label">Gender</span>
              <span className="profile-detail-value">{gender}</span>
            </div>
          </div>
        ) : (
          /* Inline Edit Form when Edit Profile is active */
          <form onSubmit={handleSave} className="profile-inline-edit-form">
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label htmlFor="editFullName" className="profile-edit-label">Full Name</label>
                <div className="profile-input-with-icon">
                  <User size={16} className="profile-field-icon" aria-hidden="true" />
                  <input
                    id="editFullName"
                    type="text"
                    className="profile-field-input"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="profile-edit-field">
                <label htmlFor="editEmail" className="profile-edit-label">Email Address</label>
                <div className="profile-input-with-icon">
                  <Mail size={16} className="profile-field-icon" aria-hidden="true" />
                  <input
                    id="editEmail"
                    type="email"
                    className="profile-field-input"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="profile-edit-field">
                <label htmlFor="editPhone" className="profile-edit-label">Phone Number (10 digits)</label>
                <div className="profile-input-with-icon">
                  <Phone size={16} className="profile-field-icon" aria-hidden="true" />
                  <input
                    id="editPhone"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    className="profile-field-input"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Gender</label>
                <div className="profile-gender-pill-group">
                  {(['Female', 'Male', 'Prefer not to say'] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`profile-gender-pill-item ${tempGender === opt ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="tempGender"
                        value={opt}
                        checked={tempGender === opt}
                        onChange={() => setTempGender(opt)}
                        className="profile-hidden-radio"
                        disabled={isSaving}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-edit-actions-row">
              <button
                type="submit"
                className="profile-save-changes-btn"
                disabled={isSaving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {isSaving && <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                className="profile-cancel-text-btn"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfileDetailsForm
