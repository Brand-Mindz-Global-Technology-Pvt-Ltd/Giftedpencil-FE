import React, { useState } from 'react'
import { ShoppingCart, Trash2, Heart } from 'lucide-react'
import { useWishlist, type WishlistItem } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

const ProfileWishlist: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [addedMessage, setAddedMessage] = useState<string | null>(null)

  const handleRemove = (id: string | number) => {
    removeFromWishlist(id)
  }

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.title,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
      slug: item.slug,
    })
    setAddedMessage(`Added "${item.title}" to your cart!`)
    setTimeout(() => setAddedMessage(null), 3000)
  }

  return (
    <div className="profile-card profile-wishlist-card">
      <div className="profile-card-header">
        <h2 className="profile-card-title">My Wishlist</h2>
        <p className="profile-card-subtitle">
          Items you&apos;ve saved to reflect on, revisit, or purchase later.
        </p>
      </div>

      {addedMessage && (
        <div className="profile-alert-success" role="status">
          <span>{addedMessage}</span>
        </div>
      )}

      {items.length > 0 ? (
        <div className="profile-wishlist-grid">
          {items.map((item) => (
            <div key={item.id} className="profile-wishlist-item">
              <div className="profile-wishlist-img-wrap">
                <img src={item.image} alt={item.title} className="profile-wishlist-img" />
                <button
                  type="button"
                  className="profile-wishlist-remove-btn"
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="profile-wishlist-content">
                <h3 className="profile-wishlist-title">{item.title}</h3>
                <p className="profile-wishlist-edition">
                  {item.description || 'First Edition • Mindful Journal'}
                </p>
                <div className="profile-wishlist-price-row">
                  <span className="profile-wishlist-price">₹{item.price.toLocaleString('en-IN')}</span>
                  <span className="profile-wishlist-stock">In Stock</span>
                </div>

                <button
                  type="button"
                  className="profile-wishlist-add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart size={16} />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-empty-state">
          <div className="profile-empty-icon-wrap" aria-hidden="true">
            <Heart size={36} strokeWidth={1.5} />
          </div>
          <h3 className="profile-empty-title">Your wishlist is empty</h3>
          <p className="profile-empty-desc">
            Explore our thoughtfully designed journals and save your favorites here.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProfileWishlist
