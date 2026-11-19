import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, X, Minus, Plus, Loader2, AlertCircle } from 'lucide-react'
import {
  getProducts,
  placeOrder,
  type SavedOrder,
} from '../../services/api'
import product1 from '../../assets/product/product-1.png'
import product2 from '../../assets/product/product-2.png'
import product3 from '../../assets/product/product-3.png'
import product4 from '../../assets/product/product-4.png'

interface ProductItem {
  id: number
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  image: string
}

// Map database image filenames (e.g. "product-1.png") to original imported assets
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'product-1.png': product1,
  'product-2.png': product2,
  'product-3.png': product3,
  'product-4.png': product4,
}

const resolveProductImage = (imageFilename: string | null | undefined): string => {
  if (!imageFilename) return product1
  const cleanName = imageFilename.split(/[/\\]/).pop() || imageFilename
  return PRODUCT_IMAGE_MAP[cleanName] || product1
}

interface FormErrors {
  name?: string
  phone?: string
  address?: string
}

const Products = () => {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState<number[]>([])

  // Products state derived strictly from the backend GET /api/products API
  const [products, setProducts] = useState<ProductItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)

  // "Your Order" Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [customerName, setCustomerName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdOrder, setCreatedOrder] = useState<SavedOrder | null>(null)

  // Fetch product data from backend API
  useEffect(() => {
    let isMounted = true

    const fetchCatalog = async () => {
      try {
        const apiData = await getProducts()
        if (!isMounted) return

        if (Array.isArray(apiData) && apiData.length > 0) {
          // Map database fields directly: id, name, price, description, and resolve image filename
          const mappedProducts: ProductItem[] = apiData.map((item) => {
            const cleanName = String(item.name || '').trim()
            const slug = cleanName
              ? cleanName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              : 'the-gifted-pencil'

            return {
              id: Number(item.id),
              slug: slug || 'the-gifted-pencil',
              name: cleanName,
              subtitle: 'Make Every Page Meaningful',
              description: String(item.description || ''),
              price:
                typeof item.price === 'number'
                  ? item.price
                  : Number(item.price) || 0,
              image: resolveProductImage(item.image),
            }
          })

          setProducts(mappedProducts)
          setApiError(null)
        } else {
          setProducts([])
          setApiError(null)
        }
      } catch (err: unknown) {
        if (!isMounted) return
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Unable to connect to product service. Please try again later.'
        setApiError(message)
        setProducts([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchCatalog()

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const handleRetry = () => {
    setIsLoading(true)
    setApiError(null)
    setRetryCount((prev) => prev + 1)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setCreatedOrder(null)
    setSubmitError(null)
    setFormErrors({})
    setIsSubmittingOrder(false)
  }

  // Handle body scroll lock & Escape key while modal is open
  useEffect(() => {
    if (!selectedProduct) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProduct])

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCardClick = (slug: string) => {
    navigate(`/product-details/${slug}`)
  }

  const handleOpenOrderModal = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation()
    setSelectedProduct(product)
    setQuantity(1)
    setCustomerName('')
    setPhone('')
    setAddress('')
    setFormErrors({})
    setSubmitError(null)
    setCreatedOrder(null)
    setIsSubmittingOrder(false)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!customerName.trim()) {
      errors.name = 'Please enter your full name.'
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, '')
    if (!cleanPhone) {
      errors.phone = 'Please enter your phone number.'
    } else if (cleanPhone.length < 10 || !/^\+?\d{10,14}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits).'
    }

    if (!address.trim()) {
      errors.address = 'Please enter your delivery address.'
    } else if (address.trim().length < 8) {
      errors.address = 'Please enter a complete address with city and pincode.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) return
    if (!validateForm()) return

    setIsSubmittingOrder(true)
    setSubmitError(null)

    try {
      // Connect order submission to backend POST /api/orders with actual API product ID
      const response = await placeOrder({
        product_id: selectedProduct.id,
        customer_name: customerName,
        phone,
        address,
        quantity,
      })

      // Show "Order Placed Successfully!" ONLY after successful backend response
      setCreatedOrder(response.order)
    } catch (err: unknown) {
      let errorMsg = 'Order submission service is currently offline. Please try again later.'
      if (err instanceof Error && err.message) {
        const isNetworkFailure =
          err.message.includes('fetch') ||
          err.message.includes('Network') ||
          err.message.includes('5000')
        if (!isNetworkFailure) {
          errorMsg = err.message
        }
      }
      setSubmitError(errorMsg)
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  return (
    <section className="products-section" aria-label="Our Products">
      <div className="products-container">
        {/* Section Heading */}
        <div className="products-header">
          <span className="products-header-line" aria-hidden="true" />
          <h2 className="products-title">Our Products</h2>
          <span className="products-header-line" aria-hidden="true" />
        </div>

        {/* API State Indicators (Loading, Empty, Error) */}
        {isLoading && (
          <div className="products-status-indicator loading" role="status">
            <Loader2 size={16} className="products-spin-icon" />
            <span>Loading products from database...</span>
          </div>
        )}

        {apiError && !isLoading && (
          <div className="products-status-indicator error" role="alert">
            <AlertCircle size={16} />
            <span>{apiError}</span>
            <button
              type="button"
              className="products-retry-btn"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !apiError && products.length === 0 && (
          <div className="products-status-indicator notice" role="status">
            <span>No products currently available in the database.</span>
          </div>
        )}

        {/* Product Cards Grid - populated strictly from API */}
        {!isLoading && !apiError && products.length > 0 && (
          <div className="products-grid single-product">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product.id)
              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleCardClick(product.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(product.slug)
                    }
                  }}
                  aria-label={`View ${product.name} details`}
                >
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => toggleWishlist(e, product.id)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.8}
                      fill={isWishlisted ? 'var(--color-olive-dark)' : 'none'}
                    />
                  </button>

                  {/* Product Image Frame */}
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Information - derived strictly from API */}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.subtitle && (
                      <p className="product-subtitle">{product.subtitle}</p>
                    )}
                    <p className="product-price">₹{product.price}</p>

                    <button
                      type="button"
                      className="product-action-btn"
                      onClick={(e) => handleOpenOrderModal(e, product)}
                      aria-label={`Buy ${product.name} now`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* "Your Order" Modal & Confirmation Dialog */}
      {selectedProduct && (
        <div
          className="order-modal-overlay"
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className="order-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              createdOrder ? 'confirmation-heading' : 'order-modal-title'
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              className="order-modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {createdOrder ? (
              /* Success Confirmation (Displayed ONLY after backend confirms successful creation) */
              <div className="order-confirmation-content">
                <div className="order-confirmation-icon-wrap" aria-hidden="true">
                  <svg
                    className="order-confirmation-check-svg"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="32" cy="32" r="32" fill="#EBF2E4" />
                    <circle cx="32" cy="32" r="25" fill="#4d5a3c" />
                    <path
                      d="M22 32.5L29 39.5L42 26.5"
                      stroke="#FFFBF5"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 id="confirmation-heading" className="order-confirmation-heading">
                  Order Placed Successfully!
                </h2>

                <p className="order-confirmation-message">
                  Thank you for your order.
                </p>

                <div className="order-confirmation-summary">
                  <p>
                    <strong>Order ID:</strong> #{createdOrder.id}
                  </p>
                  <p>
                    <strong>Product:</strong> {selectedProduct.name} (Qty: {createdOrder.quantity})
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{createdOrder.total_price}
                  </p>
                  <p>
                    <strong>Status:</strong> {createdOrder.order_status}
                  </p>
                </div>

                <button
                  type="button"
                  className="order-confirmation-close-btn"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            ) : (
              /* "Your Order" Form */
              <>
                <div className="order-modal-header">
                  <h2 id="order-modal-title" className="order-modal-title">
                    Your Order
                  </h2>
                </div>

                <div className="order-modal-body">
                  {/* Selected Product Summary - populated from actual API data */}
                  <div className="order-modal-product-summary">
                    <div className="order-modal-image-wrapper">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="order-modal-product-image"
                      />
                    </div>
                    <div className="order-modal-product-details">
                      <h3 className="order-modal-product-name">
                        {selectedProduct.name}
                      </h3>
                      <p className="order-modal-product-desc">
                        {selectedProduct.description}
                      </p>
                      <p className="order-modal-unit-price">
                        Price: <strong>₹{selectedProduct.price}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Total Price Box */}
                  <div className="order-modal-calc-box">
                    <div className="order-modal-qty-control">
                      <span className="order-modal-calc-label">Quantity:</span>
                      <div className="order-modal-counter">
                        <button
                          type="button"
                          className="order-modal-counter-btn"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1 || isSubmittingOrder}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <span
                          className="order-modal-counter-value"
                          aria-live="polite"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="order-modal-counter-btn"
                          onClick={() => handleQuantityChange(1)}
                          disabled={isSubmittingOrder}
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="order-modal-total-display">
                      <span className="order-modal-calc-label">Total Price:</span>
                      <span className="order-modal-total-amount">
                        ₹{(selectedProduct.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Backend Error Banner */}
                  {submitError && (
                    <div className="order-modal-error-banner" role="alert">
                      <AlertCircle size={18} className="order-modal-alert-icon" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Customer Details Form */}
                  <form
                    className="order-modal-form"
                    onSubmit={handleOrderSubmit}
                    noValidate
                  >
                    <div className="order-modal-field">
                      <label htmlFor="customer-name" className="order-modal-label">
                        Customer Name{' '}
                        <span className="order-modal-required">*</span>
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        className={`order-modal-input ${formErrors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g. Priya Sharma"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value)
                          if (formErrors.name) {
                            setFormErrors((prev) => ({
                              ...prev,
                              name: undefined,
                            }))
                          }
                        }}
                        autoComplete="name"
                        disabled={isSubmittingOrder}
                        required
                      />
                      {formErrors.name && (
                        <p className="order-modal-error-msg">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="order-modal-field">
                      <label htmlFor="customer-phone" className="order-modal-label">
                        Phone Number{' '}
                        <span className="order-modal-required">*</span>
                      </label>
                      <input
                        id="customer-phone"
                        type="tel"
                        className={`order-modal-input ${formErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          if (formErrors.phone) {
                            setFormErrors((prev) => ({
                              ...prev,
                              phone: undefined,
                            }))
                          }
                        }}
                        autoComplete="tel"
                        disabled={isSubmittingOrder}
                        required
                      />
                      {formErrors.phone && (
                        <p className="order-modal-error-msg">{formErrors.phone}</p>
                      )}
                    </div>

                    <div className="order-modal-field">
                      <label htmlFor="customer-address" className="order-modal-label">
                        Delivery Address{' '}
                        <span className="order-modal-required">*</span>
                      </label>
                      <textarea
                        id="customer-address"
                        rows={3}
                        className={`order-modal-textarea ${formErrors.address ? 'is-invalid' : ''}`}
                        placeholder="House/Flat No., Street, City, State, Pincode"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value)
                          if (formErrors.address) {
                            setFormErrors((prev) => ({
                              ...prev,
                              address: undefined,
                            }))
                          }
                        }}
                        autoComplete="street-address"
                        disabled={isSubmittingOrder}
                        required
                      />
                      {formErrors.address && (
                        <p className="order-modal-error-msg">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="order-modal-submit-btn"
                      disabled={isSubmittingOrder}
                    >
                      {isSubmittingOrder ? (
                        <>
                          <Loader2 size={18} className="products-spin-icon" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Products
