import { Truck, ShieldCheck, Gift } from 'lucide-react'

const CartTrustFeatures = () => {
  return (
    <div className="cart-trust-row" aria-label="Customer Guarantees">
      <div className="cart-trust-item">
        <div className="cart-trust-icon-wrap" aria-hidden="true">
          <Truck size={20} strokeWidth={1.8} />
        </div>
        <span className="cart-trust-text">Secure Delivery Across India</span>
      </div>

      <div className="cart-trust-item">
        <div className="cart-trust-icon-wrap" aria-hidden="true">
          <ShieldCheck size={20} strokeWidth={1.8} />
        </div>
        <span className="cart-trust-text">Safe &amp; Secure Payments</span>
      </div>

      <div className="cart-trust-item">
        <div className="cart-trust-icon-wrap" aria-hidden="true">
          <Gift size={20} strokeWidth={1.8} />
        </div>
        <span className="cart-trust-text">Beautiful Packaging</span>
      </div>
    </div>
  )
}

export default CartTrustFeatures
