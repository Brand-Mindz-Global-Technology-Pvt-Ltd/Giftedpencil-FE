import React from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const PaymentSteps: React.FC = () => {
  return (
    <div className="payment-stepper-wrap" aria-label="Checkout Progress">
      {/* Step 1: Address (Completed) */}
      <Link
        to="/address"
        className="payment-step-item completed"
        style={{ textDecoration: 'none', color: 'inherit' }}
        aria-label="Step 1: Address (Completed)"
      >
        <div className="payment-step-circle">
          <Check size={14} strokeWidth={2.5} />
        </div>
        <span className="payment-step-label">Address</span>
      </Link>

      <div className="payment-step-connector completed" aria-hidden="true" />

      {/* Step 2: Payment (Active) */}
      <div className="payment-step-item active" aria-current="step">
        <div className="payment-step-circle">
          <span>2</span>
        </div>
        <span className="payment-step-label">Payment</span>
      </div>

      <div className="payment-step-connector" aria-hidden="true" />

      {/* Step 3: Confirmation (Pending) */}
      <div className="payment-step-item pending">
        <div className="payment-step-circle">
          <span>3</span>
        </div>
        <span className="payment-step-label">Confirmation</span>
      </div>
    </div>
  )
}

export default PaymentSteps
