import { Lock } from 'lucide-react'

interface CartOrderSummaryProps {
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingThreshold?: number
  hasItems: boolean
  onCheckout?: () => void
}

const CartOrderSummary = ({
  itemCount,
  subtotal,
  shipping,
  total,
  freeShippingThreshold = 499,
  hasItems,
  onCheckout,
}: CartOrderSummaryProps) => {
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="order-summary-card">
      <h2 className="order-summary-title">Order Summary</h2>

      <div className="order-summary-rows">
        <div className="summary-row">
          <span className="summary-label">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="summary-value">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Shipping</span>
          <span className="summary-value">
            {hasItems ? (shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`) : '₹0.00'}
          </span>
        </div>

        {/* Free shipping banner if applicable */}
        {hasItems && amountToFreeShipping > 0 && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#FAECE0',
              color: '#7E3540',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              marginBottom: '12px',
            }}
          >
            Add items worth ₹{amountToFreeShipping.toFixed(2)} more for <strong>FREE Shipping</strong>!
          </div>
        )}

        {hasItems && shipping === 0 && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.4,
              marginBottom: '12px',
            }}
          >
            🎉 You have qualified for <strong>FREE Shipping</strong>!
          </div>
        )}

        {/* Highlighted Total Box */}
        <div className="summary-total-box">
          <span className="summary-total-label">Total</span>
          <span className="summary-total-amount">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        className="checkout-btn"
        disabled={!hasItems}
        onClick={onCheckout}
      >
        <Lock size={16} strokeWidth={2.2} aria-hidden="true" />
        <span>Proceed to Checkout &rarr;</span>
      </button>
    </div>
  )
}

export default CartOrderSummary
