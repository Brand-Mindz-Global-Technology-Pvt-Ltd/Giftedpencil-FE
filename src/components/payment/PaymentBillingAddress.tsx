import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Check } from 'lucide-react'
import type { DeliveryAddress } from '../../types/address'

const PaymentBillingAddress: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // 1. Check router navigation state
  const stateAddr = (location.state as { selectedAddress?: DeliveryAddress } | null)?.selectedAddress

  // 2. Resolve address with fallback to sessionStorage and default
  const address = (() => {
    if (stateAddr?.name && stateAddr?.addressLine) {
      return {
        name: stateAddr.name,
        addressLine: stateAddr.addressLine,
      }
    }
    try {
      const saved = sessionStorage.getItem('tgp_selected_address')
      if (saved) {
        const parsed = JSON.parse(saved) as DeliveryAddress
        if (parsed?.name && parsed?.addressLine) {
          return {
            name: parsed.name,
            addressLine: parsed.addressLine,
          }
        }
      }
    } catch {
      // ignore
    }
    return {
      name: 'Ananya R',
      addressLine: '12/4, South Street, NGO Colony, Tirunelveli – 627007, Tamil Nadu',
    }
  })()

  const handleChangeAddress = () => {
    navigate('/address')
  }

  return (
    <div className="payment-billing-block">
      <h3 className="payment-billing-title">Billing Address</h3>

      {/* Checkbox */}
      <label className="payment-checkbox-label">
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="payment-checkbox-input"
        />
        <span className="payment-custom-checkbox" aria-hidden="true">
          {sameAsShipping && <Check size={13} strokeWidth={3} />}
        </span>
        <span className="payment-checkbox-text">Same as shipping address</span>
      </label>

      {/* Address Card Box */}
      <div className="payment-address-card">
        <div className="payment-address-left">
          <div className="payment-address-pin-icon" aria-hidden="true">
            <MapPin size={18} strokeWidth={1.8} />
          </div>
          <div className="payment-address-content">
            <p className="payment-address-name">{address.name}</p>
            <p className="payment-address-text">{address.addressLine}</p>
          </div>
        </div>

        <button
          type="button"
          className="payment-address-change-btn"
          onClick={handleChangeAddress}
          aria-label="Change address"
        >
          Change
        </button>
      </div>
    </div>
  )
}

export default PaymentBillingAddress
