import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PaymentCardDetailsProps {
  cardNumber: string
  setCardNumber: (val: string) => void
  expiryDate: string
  setExpiryDate: (val: string) => void
  cvv: string
  setCvv: (val: string) => void
  cardholderName: string
  setCardholderName: (val: string) => void
}

const PaymentCardDetails: React.FC<PaymentCardDetailsProps> = ({
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  cardholderName,
  setCardholderName,
}) => {
  const [showCvv, setShowCvv] = useState(false)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.slice(0, 16)
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.slice(0, 4)
    if (val.length > 2) {
      val = `${val.slice(0, 2)} / ${val.slice(2)}`
    }
    setExpiryDate(val)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(val)
  }

  return (
    <div className="payment-card-details-block">
      <h3 className="payment-card-details-title">Card Details</h3>

      <div className="payment-form-fields">
        {/* Card Number */}
        <div className="payment-field-group">
          <label htmlFor="cardNumber" className="payment-field-label">
            Card Number <span className="payment-required">*</span>
          </label>
          <div className="payment-input-with-badges">
            <input
              id="cardNumber"
              type="text"
              className="payment-text-input"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
            <div className="payment-card-badges" aria-hidden="true">
              <span className="card-badge-logo visa">VISA</span>
              <span className="card-badge-logo mastercard">
                <span className="mc-circle mc-red" />
                <span className="mc-circle mc-yellow" />
              </span>
              <span className="card-badge-logo rupay">
                RuPay<span className="rupay-arrow">&#9658;</span>
              </span>
            </div>
          </div>
        </div>

        {/* Expiry Date & CVV */}
        <div className="payment-field-row">
          <div className="payment-field-group">
            <label htmlFor="expiryDate" className="payment-field-label">
              Expiry Date <span className="payment-required">*</span>
            </label>
            <input
              id="expiryDate"
              type="text"
              className="payment-text-input"
              placeholder="MM / YY"
              value={expiryDate}
              onChange={handleExpiryChange}
              maxLength={7}
              required
            />
          </div>

          <div className="payment-field-group">
            <label htmlFor="cvv" className="payment-field-label">
              CVV <span className="payment-required">*</span>
            </label>
            <div className="payment-cvv-wrapper">
              <input
                id="cvv"
                type={showCvv ? 'text' : 'password'}
                className="payment-text-input payment-cvv-input"
                placeholder="•••"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                required
              />
              <button
                type="button"
                className="payment-cvv-eye-btn"
                onClick={() => setShowCvv((prev) => !prev)}
                aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
              >
                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="payment-field-group">
          <label htmlFor="cardholderName" className="payment-field-label">
            Cardholder Name <span className="payment-required">*</span>
          </label>
          <input
            id="cardholderName"
            type="text"
            className="payment-text-input"
            placeholder="Enter name as on card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  )
}

export default PaymentCardDetails
