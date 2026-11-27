import React, { useState, useEffect } from 'react'
import { Truck, CheckCircle, Clock, XCircle, ArrowRight, Loader2, AlertCircle, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ordersApi, type BackendOrder } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { resolveProductImage } from '../../utils/productImages'

interface DisplayOrderItem {
  id: string
  reference: string
  date: string
  title: string
  edition: string
  price: number
  quantity: number
  status: string
  image: string
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const ProfileOrders: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [orders, setOrders] = useState<DisplayOrderItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) return

    let ignore = false

    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const serverOrders: BackendOrder[] = await ordersApi.getMyOrders()
        if (ignore) return

        const flattenedItems: DisplayOrderItem[] = []
        for (const order of serverOrders) {
          const date = formatDate(order.created_at)
          const ref = order.order_reference || String(order.id)
          const status = order.order_status || 'Pending'

          if (Array.isArray(order.items) && order.items.length > 0) {
            for (const item of order.items) {
              flattenedItems.push({
                id: `${order.id}-${item.product_id}`,
                reference: ref,
                date,
                title: item.product_name,
                edition: 'Linen Hardcover • Standard Edition',
                price: Number(item.price),
                quantity: Number(item.quantity),
                status,
                image: resolveProductImage(item.image),
              })
            }
          } else {
            flattenedItems.push({
              id: String(order.id),
              reference: ref,
              date,
              title: 'The Gifted Pencil Journal',
              edition: 'Linen Hardcover • Standard Edition',
              price: Number(order.total_price),
              quantity: 1,
              status,
              image: resolveProductImage(null),
            })
          }
        }

        setOrders(flattenedItems)
      } catch (err: unknown) {
        if (ignore) return
        const msg = err instanceof Error ? err.message : 'Unable to load orders'
        setError(msg)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      ignore = true
    }
  }, [isAuthenticated, isAuthLoading])

  const renderStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'delivered') return <CheckCircle size={14} />
    if (s === 'dispatched' || s === 'in transit') return <Truck size={14} />
    if (s === 'cancelled') return <XCircle size={14} />
    return <Clock size={14} />
  }

  return (
    <div className="profile-card profile-orders-card">
      <div className="profile-card-header">
        <h2 className="profile-card-title">My Orders</h2>
        <p className="profile-card-subtitle">
          Track your current orders and review past purchases.
        </p>
      </div>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            color: '#7E3540',
          }}
        >
          <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>
            Loading your order history...
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            margin: '20px 0',
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
          }}
          role="alert"
        >
          <AlertCircle size={20} color="#DC2626" />
          <span>{error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#7A706A',
          }}
        >
          <ShoppingBag size={42} strokeWidth={1.5} style={{ margin: '0 auto 12px', color: '#7E3540' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#3A322D', marginBottom: '6px' }}>
            No orders found
          </h3>
          <p style={{ fontSize: '13.5px', marginBottom: '20px' }}>
            You haven&apos;t placed any orders yet. Discover our journals in the shop!
          </p>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#7E3540',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '13.5px',
            }}
          >
            <span>Explore Shop</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="profile-orders-list">
          {orders.map((order) => (
            <div key={order.id} className="profile-order-item reveal-on-scroll">
              <div className="profile-order-top-bar">
                <div className="profile-order-meta">
                  <span className="profile-order-number">Order #{order.reference}</span>
                  <span className="profile-order-date">Placed on {order.date}</span>
                </div>
                <div
                  className={`profile-order-status-badge status-${order.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {renderStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="profile-order-body">
                <div className="profile-order-img-wrap">
                  <img src={order.image} alt={order.title} className="profile-order-img" />
                </div>

                <div className="profile-order-details">
                  <h3 className="profile-order-item-title">{order.title}</h3>
                  <p className="profile-order-item-edition">{order.edition}</p>
                  <div className="profile-order-price-qty">
                    <span className="profile-order-price">₹{order.price.toLocaleString('en-IN')}</span>
                    <span className="profile-order-qty">Qty: {order.quantity}</span>
                  </div>
                </div>

                <div className="profile-order-actions">
                  <button type="button" className="profile-order-track-btn">
                    <span>Track Order</span>
                    <ArrowRight size={14} />
                  </button>
                  <button type="button" className="profile-order-invoice-btn">
                    View Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileOrders
