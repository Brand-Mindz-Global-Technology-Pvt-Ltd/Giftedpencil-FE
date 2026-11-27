import React from 'react'
import { Link } from 'react-router-dom'
import { Check, MapPin, CreditCard } from 'lucide-react'

const AddressStepper: React.FC = () => {
  return (
    <div className="address-stepper-container" aria-label="Checkout Progress">
      <div className="address-stepper">
        {/* Step 1: Cart */}
        <Link to="/cart" className="address-step-item completed" aria-label="Step 1: Cart (Completed)">
          <div className="address-step-circle">
            <Check size={18} strokeWidth={2.5} />
          </div>
          <span className="address-step-label">Cart</span>
        </Link>

        {/* Connector Line: Cart to Address */}
        <div className="address-step-line completed" aria-hidden="true" />

        {/* Step 2: Address (Current Active) */}
        <div className="address-step-item active" aria-current="step">
          <div className="address-step-circle">
            <MapPin size={18} strokeWidth={2.2} />
          </div>
          <span className="address-step-label">Address</span>
        </div>

        {/* Connector Line: Address to Payment */}
        <div className="address-step-line" aria-hidden="true" />

        {/* Step 3: Payment */}
        <Link to="/payment" className="address-step-item pending" aria-label="Step 3: Payment">
          <div className="address-step-circle">
            <CreditCard size={18} strokeWidth={1.8} />
          </div>
          <span className="address-step-label">Payment</span>
        </Link>

        {/* Connector Line: Payment to Order Complete */}
        <div className="address-step-line" aria-hidden="true" />

        {/* Step 4: Order Complete */}
        <div className="address-step-item pending" aria-label="Step 4: Order Complete">
          <div className="address-step-circle">
            <Check size={18} strokeWidth={1.8} />
          </div>
          <span className="address-step-label">Order Complete</span>
        </div>
      </div>
    </div>
  )
}

export default AddressStepper
