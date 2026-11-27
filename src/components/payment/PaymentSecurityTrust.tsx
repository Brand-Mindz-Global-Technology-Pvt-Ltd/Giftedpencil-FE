import React from 'react'
import { ShieldCheck, Lock, CheckCircle2, Award } from 'lucide-react'

const PaymentSecurityTrust: React.FC = () => {
  return (
    <div className="payment-trust-card">
      {/* Top Banner Notice */}
      <div className="payment-trust-top">
        <div className="payment-trust-shield-icon" aria-hidden="true">
          <ShieldCheck size={28} strokeWidth={1.8} />
        </div>
        <div className="payment-trust-text">
          <h3 className="payment-trust-title">Secure Payment</h3>
          <p className="payment-trust-desc">
            Your payment is 100% safe and encrypted with industry-standard security.
          </p>
        </div>
      </div>

      <div className="payment-trust-divider" aria-hidden="true" />

      {/* 3 Security Badges */}
      <div className="payment-trust-badges-grid">
        <div className="payment-trust-badge-item">
          <div className="payment-badge-icon" aria-hidden="true">
            <Lock size={18} strokeWidth={1.8} />
          </div>
          <span className="payment-badge-label">Encrypted Transactions</span>
        </div>

        <div className="payment-trust-badge-item">
          <div className="payment-badge-icon" aria-hidden="true">
            <CheckCircle2 size={18} strokeWidth={1.8} />
          </div>
          <span className="payment-badge-label">Secure Checkout</span>
        </div>

        <div className="payment-trust-badge-item">
          <div className="payment-badge-icon" aria-hidden="true">
            <Award size={18} strokeWidth={1.8} />
          </div>
          <span className="payment-badge-label">Trusted Payment Partners</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentSecurityTrust
