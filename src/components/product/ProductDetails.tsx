import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Minus, Plus, ChevronRight } from 'lucide-react'
import Layout from '../common/Layout/Layout'
import productImage1 from '../../assets/product/product-1.png'
import productImage2 from '../../assets/product/product-2.png'
import productImage3 from '../../assets/product/product-3.png'
import productImage4 from '../../assets/product/product-4.png'

interface ProductConfig {
  slug: string
  name: string
  subtitle: string
  eyebrow: string
  mainImage: string
}

const PRODUCTS_MAP: Record<string, ProductConfig> = {
  'the-gifted-pencil': {
    slug: 'the-gifted-pencil',
    name: 'The Gifted Pencil',
    subtitle: 'Make Every Page Meaningful',
    eyebrow: 'A little space for big dreams',
    mainImage: productImage1,
  },
  'dream-big-journal': {
    slug: 'dream-big-journal',
    name: 'The Gifted Pencil',
    subtitle: 'Make Every Page Meaningful',
    eyebrow: 'A little space for big dreams',
    mainImage: productImage1,
  },
}

const allProductImages = [productImage1, productImage2, productImage3, productImage4]
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
  const currentProduct = (slug && PRODUCTS_MAP[slug]) || PRODUCTS_MAP['dream-big-journal']

  // Gallery displays the current product's image first, followed by the other product views
  const galleryImages = [
    currentProduct.mainImage,
    ...allProductImages.filter((img) => img !== currentProduct.mainImage),
  ]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<DetailTab>('Description')
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity)
      setActionMessage('')
      return
    }

    setActionMessage('Cart integration is not available yet.')
  }

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(quantity)
      setActionMessage('')
      return
    }

    setActionMessage('Checkout integration is not available yet.')
  }

  return (
    <Layout>
      <div className="product-details-page">
        <div className="product-details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="product-details-breadcrumb-link">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>Shop</span>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="product-details-breadcrumb-current">{currentProduct.name}</span>
        </div>

        <section className="product-details-main" aria-labelledby="product-details-title">
          <div className="product-details-gallery">
            <div className="product-details-image-frame">
              <span className="product-details-image-caption">The Gifted Pencil</span>
              <img
                className="product-details-main-image"
                src={galleryImages[selectedImage]}
                alt={`${currentProduct.name} view ${selectedImage + 1}`}
              />
              <span className="product-details-image-index">
                {String(selectedImage + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
              </span>
            </div>

            <div className="product-details-thumbnails" aria-label="Product images">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
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
          </div>

          <div className="product-details-information">
            <p className="product-details-eyebrow">{currentProduct.eyebrow}</p>
            <h1 className="product-details-title" id="product-details-title">
              {currentProduct.name}
            </h1>
            <p className="product-details-price">₹299</p>
            <p className="product-details-summary">
              A journal for your thoughts, dreams and beautiful memories.
            </p>

            <div className="product-details-divider" />

            <div className="product-details-edition">
              <span className="product-details-field-label">Edition</span>
              <span className="product-details-placeholder">Details to be confirmed</span>
            </div>

            <div className="product-details-purchase-row">
              <div className="product-details-quantity" aria-label="Quantity selector">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
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
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className={`product-details-wishlist${isWishlisted ? ' is-active' : ''}`}
                onClick={() => setIsWishlisted((current) => !current)}
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
              >
                Add to cart
              </button>
              <button
                type="button"
                className="product-details-buy-button"
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </div>
            {actionMessage && (
              <p className="product-details-action-message" role="status">
                {actionMessage}
              </p>
            )}

            <p className="product-details-note">
              Product pricing and edition details will be updated when confirmed.
            </p>
          </div>
        </section>

        <section className="product-details-more" aria-label="More product details">
          <div className="product-details-section-heading">
            <span className="product-details-section-kicker">The details</span>
            <h2>Make room for what matters.</h2>
          </div>

          <div
            className="product-details-tabs"
            role="tablist"
            aria-label="Product information"
          >
            {detailTabs.map((tab) => (
              <button
                key={tab}
                id={`product-details-tab-${detailTabs.indexOf(tab)}`}
                type="button"
                role="tab"
                className={`product-details-tab${activeTab === tab ? ' is-active' : ''}`}
                aria-selected={activeTab === tab}
                aria-controls="product-details-tab-panel"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            className="product-details-tab-panel"
            id="product-details-tab-panel"
            role="tabpanel"
            aria-labelledby={`product-details-tab-${detailTabs.indexOf(activeTab)}`}
          >
            {activeTab === 'Description' && (
              <div className="product-details-tab-text">
                <p>
                  The Gifted Pencil is created to make journaling a simple and meaningful part of everyday life. Whether you are a child discovering your imagination, an adult working towards personal goals, or an expecting mother capturing the beautiful moments of pregnancy, this journal gives you a space to express yourself in your own way.
                </p>
                <p>
                  Fill its pages with thoughts, ideas, dreams, gratitude, little achievements and special memories. There is no perfect way to journal and no pressure to write every day. Just pick up your pencil and begin wherever you are.
                </p>
                <p>
                  Because sometimes, writing down a thought is the first step towards understanding it, believing in it and making it happen.
                </p>
              </div>
            )}
            {activeTab === 'Features' && <p>Product features to be added.</p>}
            {activeTab === 'Additional information' && (
              <p>Additional product information to be added.</p>
            )}
          </div>
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
