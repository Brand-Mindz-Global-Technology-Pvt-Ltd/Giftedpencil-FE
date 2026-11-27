import React from 'react'
import paymentBannerImg from '../../assets/payment/top-banner.png'

const PaymentBanner: React.FC = () => {
  const bannerBg = `url(${paymentBannerImg})`

  return (
    <section
      className="payment-banner"
      style={{
        ['--payment-banner-bg' as string]: bannerBg,
      }}
      aria-label="Secure Payment Banner"
    >
      <div className="payment-banner-inner">
        <div className="payment-banner-content">
          <div className="payment-breadcrumb">
            <span className="payment-breadcrumb-item">Checkout</span>
            <span className="payment-breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
            <span className="payment-breadcrumb-item active">Payment</span>
          </div>

          <h1 className="payment-heading">
            Secure Payment
            <span className="payment-heart-flourish" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="payment-heart-svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </h1>

          <p className="payment-description">
            Complete your order with a safe and convenient payment method.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PaymentBanner
