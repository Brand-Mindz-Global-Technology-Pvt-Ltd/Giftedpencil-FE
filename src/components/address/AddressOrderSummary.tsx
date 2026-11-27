import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import type { DeliveryAddress } from '../../types/address'
import { useCart } from '../../context/CartContext'

interface AddressOrderSummaryProps {
  selectedAddressId?: string
  selectedAddress?: DeliveryAddress
}

const AddressOrderSummary: React.FC<AddressOrderSummaryProps> = ({ selectedAddress }) => {
  const navigate = useNavigate()
  const { items, subtotal, shipping, total } = useCart()

  const handleProceedToPayment = () => {
    if (items.length === 0) return
    if (selectedAddress) {
      sessionStorage.setItem('tgp_selected_address', JSON.stringify(selectedAddress))
    }
    navigate('/payment', { state: { selectedAddress } })
  }

  return (
    <div className="address-order-summary-card">
      {/* Header */}
      <div className="address-summary-header">
        <div className="address-summary-bag-wrap" aria-hidden="true">
          <ShoppingBag size={22} strokeWidth={2} />
        </div>
        <h2 className="address-summary-title">Order Summary</h2>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <p style={{ color: '#7A706A', fontSize: '14px', marginBottom: '16px' }}>
            Your cart is currently empty.
          </p>
          <Link
            to="/shop"
            className="address-proceed-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}
          >
            <span>Explore Shop</span>
            <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        </div>
      ) : (
        <>
          {/* Product Rows from Shared Cart */}
          <div className="address-summary-product-list">
            {items.map((item) => (
              <div key={item.id} className="address-summary-product-item">
                <div className="address-summary-product-img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="address-summary-product-img"
                  />
                </div>
                <div className="address-summary-product-info">
                  <h3 className="address-summary-product-title">{item.name}</h3>
                  <span className="address-summary-product-qty">Qty: {item.quantity}</span>
                </div>
                <div className="address-summary-product-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="address-summary-breakdown">
            <div className="address-summary-row">
              <span className="address-summary-label">Item Total</span>
              <span className="address-summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="address-summary-row">
              <span className="address-summary-label">Delivery Charges</span>
              <span className="address-summary-value">₹{shipping}</span>
            </div>
          </div>

          {/* Payable Amount Box */}
          <div className="address-payable-box">
            <span className="address-payable-label">Payable Amount</span>
            <span className="address-payable-value">₹{total.toLocaleString('en-IN')}</span>
          </div>

          {/* Primary Proceed CTA Button */}
          <button
            type="button"
            className="address-proceed-btn"
            onClick={handleProceedToPayment}
            aria-label="Proceed to Payment"
          >
            <span>Proceed to Payment</span>
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        </>
      )}
    </div>
  )
}

export default AddressOrderSummary
