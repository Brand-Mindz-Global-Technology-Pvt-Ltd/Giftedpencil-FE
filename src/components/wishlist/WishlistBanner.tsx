import React from 'react'
import topBannerImg from '../../assets/cart/top-banner.png'

const WishlistBanner: React.FC = () => {
  const bannerBg = `url(${topBannerImg})`

  return (
    <section
      className="wishlist-banner"
      style={{
        ['--wishlist-banner-bg' as string]: bannerBg,
      }}
      aria-label="Wishlist Banner"
    >
      <div className="wishlist-banner-inner">
        <div className="wishlist-banner-content">
          <div className="wishlist-eyebrow-badge">
            <span className="wishlist-eyebrow-line" aria-hidden="true" />
            <span className="wishlist-eyebrow-text">YOUR SAVED FAVORITES</span>
            <span className="wishlist-eyebrow-line" aria-hidden="true" />
          </div>

          <h1 className="wishlist-heading">
            Your <span className="wishlist-heading-script">Wishlist</span>
            <span className="wishlist-heart-flourish" aria-hidden="true">
              <svg
                viewBox="0 0 52 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="wishlist-heart-svg"
              >
                <path
                  d="M15 5.5 C13.5 3, 11 1.5, 8.5 1.5 C5 1.5, 2 3.8, 2 7.8 C2 13, 8 17.5, 15 23 C22 17.5, 28 13, 28 7.8 C28 3.8, 25 1.5, 21.5 1.5 C19 1.5, 16.5 3, 15 5.5 Z M15 23 C21 23, 27 26, 33 23 C39 20, 44 23.5, 49 22"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h1>

          <p className="wishlist-subtitle">
            All your favorite journaling essentials, kept in one place.
          </p>
        </div>
      </div>
    </section>
  )
}

export default WishlistBanner
