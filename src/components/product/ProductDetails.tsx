import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import Layout from '../common/Layout/Layout'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { productsApi, type ProductData } from '../../services/api'
import { resolveProductImages } from '../../utils/productImages'

const detailTabs = ['Description', 'Features', 'Additional information'] as const
type DetailTab = (typeof detailTabs)[number]

interface ProductDetailsProps {
  onAddToCart?: (quantity: number) => void
  onBuyNow?: (quantity: number) => void
}

interface ProductDetailsContentProps extends ProductDetailsProps {
  slug?: string
}

const ProductDetailsContent = ({
  slug,
  onAddToCart,
  onBuyNow,
}: ProductDetailsContentProps) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<DetailTab>('Description')
  const [actionMessage, setActionMessage] = useState('')

  const targetIdentifier = slug || 'the-gifted-pencil'

  const [reloadKey, setReloadKey] = useState<number>(0)
  const handleRetry = () => {
    setReloadKey((prev) => prev + 1)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    let ignore = false

    const loadData = async () => {
      setIsLoading(true)
      setFetchError(null)
      try {
        const data = await productsApi.getProductByIdOrSlug(targetIdentifier)
        if (ignore) return
        setProduct(data)
        const resolvedGallery = resolveProductImages(data.images, data.image)
        setGalleryImages(resolvedGallery)
        setSelectedImage(0)
      } catch (err: unknown) {
        if (ignore) return
        const msg =
          err instanceof Error ? err.message : 'Unable to find or load the requested product.'
        setFetchError(msg)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => {
      ignore = true
    }
  }, [targetIdentifier, reloadKey])

  const isWishlisted = product ? isInWishlist(product.slug || product.id) : false

  const handleAddToCart = () => {
    if (!product) return

    if (onAddToCart) {
      onAddToCart(quantity)
      setActionMessage('')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle || 'Make Every Page Meaningful',
      price: product.price,
      quantity,
      image: galleryImages[0] || '',
      slug: product.slug,
    })
    setActionMessage(
      `Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} of "${product.name}" to your cart!`
    )
    setTimeout(() => setActionMessage(''), 3500)
  }

  const handleBuyNow = () => {
    if (!product) return

    if (onBuyNow) {
      onBuyNow(quantity)
      setActionMessage('')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle || 'Make Every Page Meaningful',
      price: product.price,
      quantity,
      image: galleryImages[0] || '',
      slug: product.slug,
    })
    navigate('/cart')
  }

  const handleToggleWishlist = () => {
    if (!product) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product-details/${product.slug || product.id}` } })
      return
    }

    toggleWishlist({
      id: product.slug || product.id,
      title: product.name,
      description: product.subtitle || product.description,
      price: product.price,
      image: galleryImages[0] || '',
      slug: product.slug,
    })
  }

  if (isLoading) {
    return (
      <Layout>
        <div
          className="product-details-page"
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7E3540',
          }}
        >
          <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', fontSize: '16px', fontWeight: 500 }}>
            Loading product details...
          </p>
        </div>
      </Layout>
    )
  }

  if (fetchError || !product) {
    return (
      <Layout>
        <div className="product-details-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '40px 24px',
              borderRadius: '16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
            }}
          >
            <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              Product Not Found
            </h2>
            <p style={{ fontSize: '14px', color: '#7F1D1D', marginBottom: '24px' }}>
              {fetchError || "The product you're looking for does not exist or is currently unavailable."}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleRetry}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#7E3540',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <Link
                to="/shop"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#7E3540',
                  border: '1px solid #7E3540',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="product-details-page">
        <div className="product-details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="product-details-breadcrumb-link">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/shop" className="product-details-breadcrumb-link">
            Shop
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="product-details-breadcrumb-current">{product.name}</span>
        </div>

        <section className="product-details-main" aria-labelledby="product-details-title">
          <div className="product-details-gallery reveal-scale">
            <div className="product-details-image-frame" data-parallax-speed="0.06">
              <span className="product-details-image-caption" data-parallax-speed="-0.04">The Gifted Pencil</span>
              <img
                className="product-details-main-image"
                src={galleryImages[selectedImage] || galleryImages[0]}
                alt={`${product.name} view ${selectedImage + 1}`}
              />
              {galleryImages.length > 1 && (
                <span className="product-details-image-index">
                  {String(selectedImage + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                </span>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="product-details-thumbnails" aria-label="Product images">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-details-thumbnail${selectedImage === index ? ' is-selected' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-details-information reveal-slide-right">
            <p className="product-details-eyebrow" data-parallax-speed="-0.04">
              {product.eyebrow || 'A little space for big dreams'}
            </p>
            <h1 className="product-details-title" id="product-details-title">
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '16px 0 12px' }}>
              <p className="product-details-price" style={{ margin: 0 }}>₹{product.price.toLocaleString()}</p>
              {product.original_price != null && product.original_price > product.price && (
                <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '1.15rem', fontWeight: 500 }}>
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            {product.subtitle && (
              <p className="product-details-summary">
                {product.subtitle}
              </p>
            )}

            <div className="product-details-divider" />

            {product.subtitle && (
              <div className="product-details-edition">
                <span className="product-details-field-label">Edition</span>
                <span className="product-details-placeholder">
                  {product.subtitle}
                </span>
              </div>
            )}

            {product.stock !== undefined && (
              <p style={{ fontSize: '13px', fontWeight: 600, color: product.stock > 0 ? '#16A34A' : '#DC2626', margin: '8px 0 16px' }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            )}

            <div className="product-details-purchase-row">
              <div className="product-details-quantity" aria-label="Quantity selector">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || (product.stock !== undefined && product.stock <= 0)}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <output aria-live="polite" aria-label="Quantity">
                  {quantity}
                </output>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  aria-label="Increase quantity"
                  disabled={product.stock !== undefined && quantity >= product.stock}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className={`product-details-wishlist${isWishlisted ? ' is-active' : ''}`}
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={isWishlisted}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="product-details-actions">
              <button
                type="button"
                className="product-details-add-button"
                onClick={handleAddToCart}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                {product.stock !== undefined && product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
              </button>
              <button
                type="button"
                className="product-details-buy-button"
                onClick={handleBuyNow}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                {product.stock !== undefined && product.stock <= 0 ? 'Out of stock' : 'Buy now'}
              </button>
            </div>
            {actionMessage && (
              <p className="product-details-action-message" role="status">
                {actionMessage}
              </p>
            )}

            <p className="product-details-note">
              Free delivery on select orders. Standard dispatch within 2-4 business days.
            </p>
          </div>
        </section>

        <section className="product-details-more" aria-label="More product details">
          <div className="product-details-section-heading">
            <span className="product-details-section-kicker">The details</span>
            <h2>Make room for what matters.</h2>
          </div>

          {(() => {
            const availableTabs: DetailTab[] = ['Description'];
            if (product.features && product.features.length > 0) {
              availableTabs.push('Features');
            }
            if (product.specifications && Object.keys(product.specifications).length > 0) {
              availableTabs.push('Additional information');
            }

            const currentTab = availableTabs.includes(activeTab) ? activeTab : 'Description';

            return (
              <>
                {availableTabs.length > 1 && (
                  <div
                    className="product-details-tabs"
                    role="tablist"
                    aria-label="Product information"
                  >
                    {availableTabs.map((tab) => (
                      <button
                        key={tab}
                        id={`product-details-tab-${tab}`}
                        type="button"
                        role="tab"
                        className={`product-details-tab${currentTab === tab ? ' is-active' : ''}`}
                        aria-selected={currentTab === tab}
                        aria-controls="product-details-tab-panel"
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="product-details-tab-panel"
                  id="product-details-tab-panel"
                  role="tabpanel"
                  aria-labelledby={`product-details-tab-${currentTab}`}
                >
                  {currentTab === 'Description' && (
                    <div className="product-details-tab-text">
                      <p>{product.description}</p>
                    </div>
                  )}

                  {currentTab === 'Features' && product.features && product.features.length > 0 && (
                    <div className="product-details-tab-text">
                      {product.features.map((feature, idx) => (
                        <p key={idx}>• {feature}</p>
                      ))}
                    </div>
                  )}

                  {currentTab === 'Additional information' &&
                    product.specifications &&
                    Object.keys(product.specifications).length > 0 && (
                      <div className="product-details-tab-text">
                        {Object.entries(product.specifications).map(([key, val]) => (
                          <p key={key}>
                            <strong>{key}:</strong> {val}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              </>
            );
          })()}
        </section>
      </div>
    </Layout>
  )
}

const ProductDetails = ({ onAddToCart, onBuyNow }: ProductDetailsProps) => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <ProductDetailsContent
      key={slug || 'default'}
      slug={slug}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
    />
  )
}

export default ProductDetails
