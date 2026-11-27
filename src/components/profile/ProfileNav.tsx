import React from 'react'
import { Package, Heart, Lock, LogOut, ChevronRight } from 'lucide-react'

export type ProfileTabType =
  | 'profile'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'password'

interface ProfileNavProps {
  activeTab: ProfileTabType
  onSelectTab: (tab: ProfileTabType) => void
  onLogout: () => void
}

const ProfileNav: React.FC<ProfileNavProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  return (
    <nav className="profile-action-cards-grid" aria-label="Account navigation options">
      {/* 1. My Orders */}
      <button
        type="button"
        className={`profile-action-nav-card ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => onSelectTab('orders')}
        aria-label="View My Orders"
      >
        <div className="profile-action-card-left">
          <div className="profile-action-icon-wrap" aria-hidden="true">
            <Package size={22} strokeWidth={1.8} />
          </div>
          <span className="profile-action-card-label">My Orders</span>
        </div>
        <div className="profile-action-chevron" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.2} />
        </div>
      </button>

      {/* 2. Wishlist */}
      <button
        type="button"
        className={`profile-action-nav-card ${activeTab === 'wishlist' ? 'active' : ''}`}
        onClick={() => onSelectTab('wishlist')}
        aria-label="View Wishlist"
      >
        <div className="profile-action-card-left">
          <div className="profile-action-icon-wrap" aria-hidden="true">
            <Heart size={22} strokeWidth={1.8} />
          </div>
          <span className="profile-action-card-label">Wishlist</span>
        </div>
        <div className="profile-action-chevron" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.2} />
        </div>
      </button>

      {/* 3. Change Password */}
      <button
        type="button"
        className={`profile-action-nav-card ${activeTab === 'password' ? 'active' : ''}`}
        onClick={() => onSelectTab('password')}
        aria-label="Change Password"
      >
        <div className="profile-action-card-left">
          <div className="profile-action-icon-wrap" aria-hidden="true">
            <Lock size={22} strokeWidth={1.8} />
          </div>
          <span className="profile-action-card-label">Change Password</span>
        </div>
        <div className="profile-action-chevron" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.2} />
        </div>
      </button>

      {/* 4. Logout */}
      <button
        type="button"
        className="profile-action-nav-card profile-action-logout"
        onClick={onLogout}
        aria-label="Logout of account"
      >
        <div className="profile-action-card-left">
          <div className="profile-action-icon-wrap" aria-hidden="true">
            <LogOut size={22} strokeWidth={1.8} />
          </div>
          <span className="profile-action-card-label">Logout</span>
        </div>
        <div className="profile-action-chevron" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.2} />
        </div>
      </button>
    </nav>
  )
}

export default ProfileNav
