import React from 'react'
import { CreditCard, Landmark, Wallet, Check } from 'lucide-react'

export type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallets'

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodType
  onSelectMethod: (method: PaymentMethodType) => void
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="payment-methods-block">
      <h2 className="payment-section-title">Choose a Payment Method</h2>

      <div className="payment-methods-grid" role="radiogroup" aria-label="Payment Methods">
        {/* 1. Credit / Debit Card */}
        <button
          type="button"
          className={`payment-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
          onClick={() => onSelectMethod('card')}
          role="radio"
          aria-checked={selectedMethod === 'card'}
        >
          {selectedMethod === 'card' && (
            <span className="payment-method-check" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
          <div className="payment-method-icon-wrap" aria-hidden="true">
            <CreditCard size={24} strokeWidth={1.8} />
          </div>
          <span className="payment-method-label">Credit /<br />Debit Card</span>
        </button>

        {/* 2. UPI */}
        <button
          type="button"
          className={`payment-method-card ${selectedMethod === 'upi' ? 'selected' : ''}`}
          onClick={() => onSelectMethod('upi')}
          role="radio"
          aria-checked={selectedMethod === 'upi'}
        >
          {selectedMethod === 'upi' && (
            <span className="payment-method-check" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
          <div className="payment-method-icon-wrap" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              width="24"
              height="24"
              fill="none"
              className="upi-custom-svg"
            >
              <path d="M12 7L23 16L12 25" stroke="#E66526" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 7L18 16L7 25" stroke="#097939" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="payment-method-label">UPI</span>
        </button>

        {/* 3. Net Banking */}
        <button
          type="button"
          className={`payment-method-card ${selectedMethod === 'netbanking' ? 'selected' : ''}`}
          onClick={() => onSelectMethod('netbanking')}
          role="radio"
          aria-checked={selectedMethod === 'netbanking'}
        >
          {selectedMethod === 'netbanking' && (
            <span className="payment-method-check" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
          <div className="payment-method-icon-wrap" aria-hidden="true">
            <Landmark size={24} strokeWidth={1.8} />
          </div>
          <span className="payment-method-label">Net<br />Banking</span>
        </button>

        {/* 4. Wallets */}
        <button
          type="button"
          className={`payment-method-card ${selectedMethod === 'wallets' ? 'selected' : ''}`}
          onClick={() => onSelectMethod('wallets')}
          role="radio"
          aria-checked={selectedMethod === 'wallets'}
        >
          {selectedMethod === 'wallets' && (
            <span className="payment-method-check" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
          <div className="payment-method-icon-wrap" aria-hidden="true">
            <Wallet size={24} strokeWidth={1.8} />
          </div>
          <span className="payment-method-label">Wallets</span>
        </button>
      </div>
    </div>
  )
}

export default PaymentMethods
