import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProfileBanner from '../components/profile/ProfileBanner'
import ProfileNav, { type ProfileTabType } from '../components/profile/ProfileNav'
import ProfileDetailsForm from '../components/profile/ProfileDetailsForm'
import ProfileOrders from '../components/profile/ProfileOrders'
import ProfileWishlist from '../components/profile/ProfileWishlist'
import ProfileAddresses from '../components/profile/ProfileAddresses'
import ProfilePassword from '../components/profile/ProfilePassword'
import { useAuth } from '../context/AuthContext'

const VALID_TABS: readonly ProfileTabType[] = [
  'profile',
  'orders',
  'wishlist',
  'addresses',
  'password',
]

const Profile: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get('tab') as ProfileTabType | null
  const activeTab: ProfileTabType =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'profile'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const handleSelectTab = (tab: ProfileTabType) => {
    setSearchParams(tab === 'profile' ? {} : { tab })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="profile-page">
      {/* 1. Top Hero Banner (pure visual, matching reference) */}
      <ProfileBanner />

      {/* 2. Main Profile Content Container */}
      <main className="profile-main-section">
        <div className="profile-main-container">
          {/* Subtab Back Navigation when not on main profile */}
          {activeTab !== 'profile' && (
            <div className="profile-back-bar">
              <button
                type="button"
                className="profile-back-btn"
                onClick={() => handleSelectTab('profile')}
              >
                <ArrowLeft size={16} />
                <span>Back to Profile</span>
              </button>
            </div>
          )}

          {/* Active Content Section */}
          <div className="profile-center-content-wrap">
            {activeTab === 'profile' && <ProfileDetailsForm />}
            {activeTab === 'orders' && <ProfileOrders />}
            {activeTab === 'wishlist' && <ProfileWishlist />}
            {activeTab === 'addresses' && <ProfileAddresses />}
            {activeTab === 'password' && <ProfilePassword />}
          </div>

          {/* 3. Bottom 4 Action Navigation Cards */}
          <ProfileNav
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onLogout={handleLogout}
          />
        </div>
      </main>
    </div>
  )
}

export default Profile
