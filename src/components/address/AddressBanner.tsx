import React from 'react'
import topBannerImg from '../../assets/cart/top-banner.png'

const AddressBanner: React.FC = () => {
  const bannerBg = `url(${topBannerImg})`

  return (
    <section
      className="address-banner"
      style={{
        ['--address-banner-bg' as string]: bannerBg,
      }}
      aria-label="Address Banner"
    >
      <div className="address-banner-inner">
        <div className="address-banner-content">
          <div className="address-eyebrow-badge">
            <span className="address-eyebrow-line" aria-hidden="true" />
            <span className="address-eyebrow-text">CHECKOUT · STEP 2</span>
            <span className="address-eyebrow-line" aria-hidden="true" />
          </div>

          <h1 className="address-heading">
            Select <span className="address-heading-script">Address</span>
            <span className="address-heart-flourish" aria-hidden="true">
              <svg
                viewBox="0 0 52 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="address-heart-svg"
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

          <p className="address-subtitle">
            Choose or add a delivery address for your order.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AddressBanner
