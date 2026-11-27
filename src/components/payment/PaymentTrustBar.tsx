import React from 'react'
import { Truck, RotateCcw, Lock, Headphones } from 'lucide-react'

const PaymentTrustBar: React.FC = () => {
  return (
    <section className="payment-trust-bar-section" aria-label="Customer Guarantees">
      <div className="payment-trust-bar-container">
        {/* 1. Fast & Reliable Delivery */}
        <div className="payment-trust-bar-item">
          <div className="payment-trust-bar-icon" aria-hidden="true">
            <Truck size={22} strokeWidth={1.8} />
          </div>
          <span className="payment-trust-bar-label">Fast &amp; Reliable Delivery</span>
        </div>

        {/* 2. Easy Returns */}
        <div className="payment-trust-bar-item">
          <div className="payment-trust-bar-icon" aria-hidden="true">
            <RotateCcw size={22} strokeWidth={1.8} />
          </div>
          <span className="payment-trust-bar-label">Easy Returns (Eligible Items)</span>
        </div>

        {/* 3. Safe & Secure Payments */}
        <div className="payment-trust-bar-item">
          <div className="payment-trust-bar-icon" aria-hidden="true">
            <Lock size={22} strokeWidth={1.8} />
          </div>
          <span className="payment-trust-bar-label">Safe &amp; Secure Payments</span>
        </div>

        {/* 4. Dedicated Support */}
        <div className="payment-trust-bar-item">
          <div className="payment-trust-bar-icon" aria-hidden="true">
            <Headphones size={22} strokeWidth={1.8} />
          </div>
          <span className="payment-trust-bar-label">Dedicated Support</span>
        </div>
      </div>
    </section>
  )
}

export default PaymentTrustBar
