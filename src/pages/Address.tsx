import React, { useState, useEffect, useCallback } from 'react'
import AddressBanner from '../components/address/AddressBanner'
import AddressStepper from '../components/address/AddressStepper'
import AddressList from '../components/address/AddressList'
import { type DeliveryAddress } from '../types/address'
import AddressOrderSummary from '../components/address/AddressOrderSummary'

const Address: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | undefined>(() => {
    try {
      const saved = sessionStorage.getItem('tgp_selected_address')
      if (saved) {
        return JSON.parse(saved) as DeliveryAddress
      }
    } catch {
      // fallback
    }
    return undefined
  })

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    selectedAddress?.id || ''
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSelectAddress = useCallback((id: string, addr?: DeliveryAddress) => {
    setSelectedAddressId(id)
    if (addr) {
      setSelectedAddress(addr)
      try {
        sessionStorage.setItem('tgp_selected_address', JSON.stringify(addr))
      } catch {
        // storage unavailable
      }
    }
  }, [])

  return (
    <div className="address-page">
      {/* 1. Top Banner (Cart-style Banner) */}
      <AddressBanner />

      {/* 2. Main Address Section */}
      <main className="address-main-section">
        <div className="address-main-container">
          {/* Stepper Progress Bar */}
          <AddressStepper />

          {/* 2-Column Split: Select Delivery Address & Order Summary */}
          <div className="address-content-layout">
            <div className="address-list-column reveal-slide-left">
              <AddressList
                selectedId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
              />
            </div>

            <div className="address-summary-column reveal-slide-right">
              <AddressOrderSummary
                selectedAddressId={selectedAddressId}
                selectedAddress={selectedAddress}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Address
