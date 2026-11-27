import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react'
import CartBanner from '../components/cart/CartBanner'
import CartItem from '../components/cart/CartItem'
import CartOrderSummary from '../components/cart/CartOrderSummary'
import CartTrustFeatures from '../components/cart/CartTrustFeatures'
import CTA from '../components/home/CTA'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    isLoading,
    cartError,
    updateQuantity,
    removeItem,
    refreshCart,
  } = useCart()

  return (
    <div className="cart-page">
      <CartBanner />

      <section className="cart-main-section">
        <div className="cart-main-container">
          {/* Left Column: Items */}
          <div className="cart-left-col">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 className="cart-section-title" style={{ margin: 0 }}>
                Cart Items ({itemCount})
              </h2>
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7E3540', fontSize: '13px' }}>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Updating...</span>
                </div>
              )}
            </div>

            {/* Error Notification if an action failed */}
            {cartError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  fontSize: '13.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} color="#DC2626" />
                  <span>{cartError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => refreshCart()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#991B1B',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '13px',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {items.length > 0 ? (
              <div className="cart-items-card reveal-on-scroll">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="cart-empty-state reveal-scale">
                <div className="cart-empty-icon-box" aria-hidden="true">
                  <ShoppingBag size={38} strokeWidth={1.6} />
                </div>
                <h3 className="cart-empty-title">Your cart is empty</h3>
                <p className="cart-empty-desc">
                  Looks like you haven&apos;t added any journals yet. Explore our handcrafted
                  collection to find your space to write, dream, and grow.
                </p>
                <Link to="/#products" className="cart-explore-btn">
                  Explore Journals &rarr;
                </Link>
              </div>
            ) : null}

            <div className="cart-bottom-actions">
              <Link to="/#products" className="continue-shopping-link">
                &larr; Continue Shopping
              </Link>
            </div>

            {/* Trust Features positioned on the Left Side below Continue Shopping */}
            <CartTrustFeatures />
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-right-col reveal-slide-right">
            <CartOrderSummary
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              freeShippingThreshold={freeShippingThreshold}
              hasItems={items.length > 0}
              onCheckout={() => navigate('/address')}
            />
          </div>
        </div>
      </section>

      {/* Reused Home Page CTA Banner */}
      <CTA />
    </div>
  )
}

export default Cart
