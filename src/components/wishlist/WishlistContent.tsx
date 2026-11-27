import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  X,
  ShoppingCart,
  Share2,
  Trash2,
  Check,
} from 'lucide-react'
import { useWishlist, type WishlistItem } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

const WishlistContent: React.FC = () => {
  const navigate = useNavigate()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [copied, setCopied] = useState(false)
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  const handleRemove = (id: string | number) => {
    removeFromWishlist(id)
  }

  const handleClearAll = () => {
    clearWishlist()
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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
    setAddedItemIds((prev) => ({ ...prev, [String(item.id)]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [String(item.id)]: false }))
    }, 2000)
  }

  return (
    <div className="wishlist-content-section">
      {/* Top Header Bar */}
      <div className="wishlist-toolbar">
        <div className="wishlist-count-heading-wrap">
          <h2 className="wishlist-count-title">
            My Wishlist{' '}
            <span className="wishlist-count-number">
              ({items.length} {items.length === 1 ? 'Item' : 'Items'})
            </span>
          </h2>
        </div>

        {items.length > 0 && (
          <div className="wishlist-toolbar-actions">
            <button
              type="button"
              className="wishlist-action-btn wishlist-share-btn"
              onClick={handleShare}
              aria-label="Share Wishlist"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Share Wishlist</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="wishlist-action-btn wishlist-clear-btn"
              onClick={handleClearAll}
              aria-label="Clear All Items"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {items.length > 0 ? (
        <div className="wishlist-grid" role="list">
          {items.map((item) => {
            const isAdded = !!addedItemIds[String(item.id)]

            return (
              <article key={item.id} className="wishlist-item-card reveal-scale" role="listitem">
                <div className="wishlist-card-main-split">
                  {/* Left: Product Image */}
                  <div className="wishlist-card-image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="wishlist-card-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Right: Details & Header */}
                  <div className="wishlist-card-details">
                    <div className="wishlist-card-top-icons">
                      <span className="wishlist-heart-badge" aria-label="Item is wishlisted">
                        <Heart size={14} fill="currentColor" />
                      </span>
                      <button
                        type="button"
                        className="wishlist-remove-icon-btn"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.title} from wishlist`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <h3 className="wishlist-card-title">{item.title}</h3>
                    {item.description && (
                      <p className="wishlist-card-description">{item.description}</p>
                    )}

                    <div className="wishlist-card-price-row">
                      <span className="wishlist-card-price">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && (
                        <span className="wishlist-card-original-price">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {item.discountPercent && (
                        <span className="wishlist-card-discount-badge">
                          {item.discountPercent}% Off
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Button Actions */}
                <div className="wishlist-card-actions-row">
                  <button
                    type="button"
                    className="wishlist-card-add-btn"
                    onClick={() => handleAddToCart(item)}
                    aria-label={`Add ${item.title} to cart`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={15} />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={15} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="wishlist-card-view-btn"
                    onClick={() => navigate(`/product-details/${item.slug || 'the-gifted-pencil'}`)}
                    aria-label={`View ${item.title} product details`}
                  >
                    View Product
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="wishlist-empty-container reveal-scale">
          <div className="wishlist-empty-icon-wrap" aria-hidden="true">
            <Heart size={36} strokeWidth={1.5} />
          </div>
          <h3 className="wishlist-empty-title">Your Wishlist is Empty</h3>
          <p className="wishlist-empty-desc">
            You haven&apos;t saved any journals or planners to your wishlist yet.
            Explore our thoughtfully curated collection to get inspired.
          </p>
          <Link to="/shop" className="wishlist-empty-cta-btn">
            Explore Journals &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}

export default WishlistContent
