import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const PaymentOrderSummary: React.FC = () => {
  const { items, itemCount, subtotal, shipping, total } = useCart()

  return (
    <div className="payment-summary-card">
      <h2 className="payment-summary-title">
        Order Summary ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
      </h2>

      {items.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <p style={{ color: '#7A706A', fontSize: '14px', marginBottom: '16px' }}>
            Your cart is currently empty.
          </p>
          <Link
            to="/shop"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#7E3540',
              color: '#ffffff',
              borderRadius: '24px',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <>
          {/* Item List from Shared Cart */}
          <div className="payment-summary-items-list">
            {items.map((item) => (
              <div key={item.id} className="payment-summary-item">
                <div className="payment-summary-img-wrap">
                  <img src={item.image} alt={item.name} className="payment-summary-img" />
                </div>

                <div className="payment-summary-item-details">
                  <h3 className="payment-summary-item-title">{item.name}</h3>
                  {item.subtitle && <p className="payment-summary-item-specs">{item.subtitle}</p>}
                  <p className="payment-summary-item-qty">Qty: {item.quantity}</p>
                </div>

                <div className="payment-summary-item-price">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="payment-summary-divider" aria-hidden="true" />

          {/* Cost Breakdown */}
          <div className="payment-cost-breakdown">
            <div className="payment-breakdown-row">
              <span className="payment-breakdown-label">
                Subtotal ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
              </span>
              <span className="payment-breakdown-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="payment-breakdown-row">
              <span className="payment-breakdown-label">Shipping</span>
              <span className="payment-breakdown-value">₹{shipping}</span>
            </div>
          </div>

          {/* Total Payable Box */}
          <div className="payment-total-payable-box">
            <span className="payment-total-label">Total Payable</span>
            <span className="payment-total-amount">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentOrderSummary
