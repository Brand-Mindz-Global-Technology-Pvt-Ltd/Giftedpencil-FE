import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Package, MapPin, Calendar, ArrowRight, ShoppingBag } from 'lucide-react'
import type { BackendOrder } from '../services/api'
import { resolveProductImage } from '../utils/productImages'

const OrderConfirmation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = (location.state as { order?: BackendOrder } | null)?.order

  useEffect(() => {
    window.scrollTo(0, 0)
    // If user accesses /order-confirmation without order state, redirect back to shop
    if (!order) {
      const timer = setTimeout(() => {
        navigate('/shop', { replace: true })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [order, navigate])

  if (!order) {
    return (
      <div className="order-confirmation-page" style={{ minHeight: '60vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', color: '#7E3540' }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 16px', color: '#7E3540' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>No Order Found</h2>
          <p style={{ fontSize: '14px', color: '#7A706A', marginBottom: '24px' }}>
            Redirecting you to our collection...
          </p>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#7E3540',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            <span>Explore Shop</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const orderReference = order.order_reference || `TGP-${order.id}`
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Today'

  const shippingSnapshot = order.delivery_address_snapshot || order.delivery_address
  const customerName = shippingSnapshot?.customer_name || order.customer_name
  const addressLine = shippingSnapshot?.addressLine || order.address
  const phone = shippingSnapshot?.phone || order.phone

  return (
    <div className="order-confirmation-page" style={{ padding: '60px 20px 100px', backgroundColor: '#FDFBF7' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Success Header Box */}
        <div
          className="order-confirmation-box reveal-scale"
          style={{
            textAlign: 'center',
            padding: '36px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #F1E9E4',
            marginBottom: '24px',
          }}
        >
          <div
            className="order-confirmation-badge"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={36} color="#059669" />
          </div>

          <span
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#059669',
            }}
          >
            Order Placed Successfully
          </span>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#3A322D',
              marginTop: '8px',
              marginBottom: '12px',
              fontFamily: 'var(--font-heading, serif)',
            }}
          >
            Thank You, {customerName}!
          </h1>

          <p style={{ fontSize: '14.5px', color: '#6A5E57', maxWidth: '440px', margin: '0 auto 20px' }}>
            Your order has been recorded in our system. We are preparing your handcrafted journals with care.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              backgroundColor: '#FAECE0',
              borderRadius: '24px',
              color: '#7E3540',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <span>Order Reference:</span>
            <span style={{ letterSpacing: '0.5px' }}>{orderReference}</span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #F1E9E4',
            padding: '28px 24px',
            marginBottom: '24px',
          }}
        >
          {/* Metadata Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid #F1E9E4',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="#7E3540" />
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', color: '#8A7E76', textTransform: 'uppercase' }}>
                  Date Placed
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#3A322D' }}>{orderDate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={18} color="#7E3540" />
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', color: '#8A7E76', textTransform: 'uppercase' }}>
                  Status
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#7E3540' }}>{order.order_status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="#7E3540" />
              <div>
                <span style={{ display: 'block', fontSize: '11.5px', color: '#8A7E76', textTransform: 'uppercase' }}>
                  Payment Method
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#3A322D' }}>
                  {order.payment_method || 'Online (Simulated)'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F1E9E4' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#7E3540', marginBottom: '8px' }}>
              Shipping Address
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#3A322D', margin: 0 }}>{customerName}</p>
            <p style={{ fontSize: '13.5px', color: '#6A5E57', margin: '4px 0' }}>{addressLine}</p>
            {phone && (
              <p style={{ fontSize: '13px', color: '#8A7E76', margin: 0 }}>Phone: +91 {phone}</p>
            )}
          </div>

          {/* Items List */}
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#7E3540', marginBottom: '16px' }}>
            Ordered Items ({order.items.reduce((sum, it) => sum + it.quantity, 0)})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '10px',
                  backgroundColor: '#FAF7F5',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={resolveProductImage(item.image)}
                    alt={item.product_name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#3A322D', margin: 0 }}>
                      {item.product_name}
                    </h4>
                    <span style={{ fontSize: '12.5px', color: '#8A7E76' }}>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#7E3540' }}>
                  ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div
            style={{
              borderTop: '1px solid #F1E9E4',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#6A5E57' }}>
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#6A5E57' }}>
              <span>Delivery Fee</span>
              <span>
                {Number(order.shipping_fee) === 0 ? 'FREE' : `₹${Number(order.shipping_fee).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '17px',
                fontWeight: 700,
                color: '#7E3540',
                borderTop: '1px solid #F1E9E4',
                paddingTop: '12px',
                marginTop: '4px',
              }}
            >
              <span>Total Amount</span>
              <span>₹{Number(order.total_price).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link
            to="/profile?tab=orders"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#7E3540',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>View in My Orders</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/shop"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#7E3540',
              border: '1px solid #7E3540',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
