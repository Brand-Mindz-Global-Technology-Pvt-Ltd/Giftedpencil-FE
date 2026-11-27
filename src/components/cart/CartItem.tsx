import { Heart, Minus, Plus, Trash2 } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'

export interface CartItemData {
  id: number | string
  name: string
  subtitle?: string
  price: number
  quantity: number
  image: string
}

interface CartItemProps {
  item: CartItemData
  onUpdateQuantity: (id: number | string, delta: number) => void
  onRemove: (id: number | string) => void
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(item.id)

  const itemTotal = item.price * item.quantity

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: item.id,
      title: item.name,
      description: item.subtitle,
      price: item.price,
      image: item.image,
    })
  }

  return (
    <div className="cart-item-row">
      {/* Left: Product Image & Wishlist Button */}
      <div className="cart-item-image-wrapper">
        <button
          type="button"
          className={`cart-item-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            fill={isWishlisted ? '#7E3540' : 'none'}
            color={isWishlisted ? '#7E3540' : '#495240'}
          />
        </button>
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>

      {/* Middle: Details */}
      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.name}</h3>
        <p className="cart-item-subtitle">{item.subtitle}</p>
        <p className="cart-item-unit-price">₹{item.price.toFixed(2)}</p>
      </div>

      {/* Quantity Selector */}
      <div className="cart-item-quantity-wrapper">
        <div className="cart-qty-counter">
          <button
            type="button"
            className="cart-qty-btn"
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={2.2} />
          </button>
          <span className="cart-qty-value">{item.quantity}</span>
          <button
            type="button"
            className="cart-qty-btn"
            onClick={() => onUpdateQuantity(item.id, 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="cart-item-total-col">
        <span className="cart-item-total-price">₹{itemTotal.toFixed(2)}</span>
      </div>

      {/* Remove Button */}
      <div className="cart-item-action-col">
        <button
          type="button"
          className="cart-item-remove-btn"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={18} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
