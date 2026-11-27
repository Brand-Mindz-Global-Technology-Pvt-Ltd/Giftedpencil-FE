import React from 'react'
import profileBannerImg from '../../assets/profile/top-banner.png'

const ProfileBanner: React.FC = () => {
  return (
    <section
      className="profile-banner"
      style={{ backgroundImage: `url(${profileBannerImg})` }}
      aria-label="Profile Banner"
    >
      <div className="profile-banner-inner">
        <div className="profile-banner-content reveal-on-scroll">
          <h1 className="profile-banner-heading">
            My <span className="profile-banner-script">Profile</span>
            <span className="profile-banner-heart-wrap" aria-hidden="true">
              <svg
                viewBox="0 0 52 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="profile-banner-heart-svg"
              >
                <path
                  d="M15 5.5 C13.5 3, 11 1.5, 8.5 1.5 C5 1.5, 2 3.8, 2 7.8 C2 13, 8 17.5, 15 23 C22 17.5, 28 13, 28 7.8 C28 3.8, 25 1.5, 21.5 1.5 C19 1.5, 16.5 3, 15 5.5 Z M15 23 C21 23, 27 26, 33 23 C39 20, 44 23.5, 49 22"
                  stroke="#7E3540"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h1>

          <p className="profile-banner-description">
            Manage your personal information and keep it up to date.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProfileBanner
