import topBannerImg from '../../assets/cart/top-banner.png'

const CartBanner = () => {
  const bannerBg = `url(${topBannerImg})`

  return (
    <section
      className="cart-banner"
      style={{
        ['--cart-banner-bg' as string]: bannerBg,
      }}
      aria-label="Cart Banner"
    >
      <div className="cart-banner-inner">
        <div className="cart-banner-content">
          <div className="cart-eyebrow-badge">
            <span className="cart-eyebrow-line" aria-hidden="true" />
            <span className="cart-eyebrow-text">YOUR CART</span>
            <span className="cart-eyebrow-line" aria-hidden="true" />
          </div>

          <h1 className="cart-heading">
            Your Cart{' '}
            <span className="cart-heart" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="cart-heart-svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </h1>

          <p className="cart-subtitle">
            Review your items, update your preferences and proceed to checkout.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CartBanner
