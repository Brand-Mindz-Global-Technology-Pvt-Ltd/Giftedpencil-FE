import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Check, SlidersHorizontal, ChevronDown, X, Loader2, AlertCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productsApi, type ProductData } from '../../services/api'
import { resolveProductImage } from '../../utils/productImages'

export interface ShopProductItem {
  id: number
  slug: string
  name: string
  subtitle?: string
  price: number
  image: string
  badge?: string
  inStock?: boolean
}

const PAGE_SIZE = 9

const ShopProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || searchParams.get('q') || ''

  const { addToCart } = useCart()
  const [products, setProducts] = useState<ShopProductItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [maxPrice, setMaxPrice] = useState<number>(3000)
  const [sortBy, setSortBy] = useState<string>('popular')
  const [addedProductId, setAddedProductId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [reloadKey, setReloadKey] = useState<number>(0)
  const handleRetry = () => {
    setReloadKey((prev) => prev + 1)
  }

  useEffect(() => {
    let ignore = false
    const loadData = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const response = await productsApi.getProducts({ limit: 100 })
        if (ignore) return
        const mapped: ShopProductItem[] = response.products.map((p: ProductData) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle,
          price: p.price,
          image: resolveProductImage(p.image),
          badge: p.id === 1 ? 'Best Seller' : undefined,
          inStock: p.in_stock !== false,
        }))
        setProducts(mapped)
      } catch (err: unknown) {
        if (ignore) return
        const msg =
          err instanceof Error ? err.message : 'Unable to load products. Please check your connection.'
        setErrorMessage(msg)
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
  }, [reloadKey])

  // Filter products by price range and search query
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q))
      )
    }

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [products, maxPrice, sortBy, searchQuery])

  // Pagination calculation
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle || '',
      price: product.price,
      quantity: 1,
      image: product.image,
      slug: product.slug,
    })

    setAddedProductId(productId)
    setToastMessage(`"${product.name}" added to your cart.`)

    setTimeout(() => {
      setAddedProductId((current) => (current === productId ? null : current))
    }, 2800)

    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    newParams.delete('q')
    setSearchParams(newParams)
    setCurrentPage(1)
  }

  const handleResetFilter = () => {
    setMaxPrice(3000)
    handleClearSearch()
  }

  return (
    <section className="shop-product-section" aria-label="Our Available Products">
      <div className="shop-product-container">
        <div className="shop-main-layout">
          {/* Left Sidebar: Filter Section */}
          <aside className="shop-sidebar" aria-label="Product Filters">
            <div className="shop-filter-panel">
              <div className="shop-filter-header">
                <h2 className="shop-filter-heading">Filters</h2>
                <SlidersHorizontal size={18} className="shop-filter-icon" aria-hidden="true" />
              </div>

              {/* Price Range Filter (Single required filter) */}
              <div className="shop-filter-group">
                <div className="shop-filter-title-row">
                  <span className="shop-filter-title">Price Range</span>
                  <ChevronDown size={16} className="shop-filter-chevron" aria-hidden="true" />
                </div>

                <div className="shop-price-slider-wrap">
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="shop-price-slider"
                    aria-label="Filter products by maximum price"
                  />
                  <div className="shop-price-range-text">
                    <span>₹100</span>
                    <span className="shop-price-sep">–</span>
                    <span className="shop-price-current">₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {maxPrice < 3000 && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="shop-filter-reset-btn"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Area: Dynamic Grid & Header */}
          <main className="shop-catalog-area">
            {/* Catalog Toolbar */}
            <div className="shop-catalog-toolbar">
              <div className="shop-product-count">
                {isLoading ? (
                  <span>Loading products...</span>
                ) : totalItems === 0 ? (
                  <span>Showing 0 products</span>
                ) : totalItems === 1 ? (
                  <span>Showing 1 of 1 product</span>
                ) : (
                  <span>
                    Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalItems)} of {totalItems} products
                  </span>
                )}
              </div>

              <div className="shop-sort-wrap">
                <label htmlFor="shop-sort-select" className="shop-sort-label">
                  Sort by:
                </label>
                <div className="shop-select-wrapper">
                  <select
                    id="shop-sort-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="shop-sort-select"
                    disabled={isLoading}
                  >
                    <option value="popular">Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <ChevronDown size={14} className="shop-select-arrow" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Search Query Feedback Banner */}
            {searchQuery && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '0 0 20px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#FAECE0',
                  color: '#7E3540',
                  fontSize: '13.5px',
                  fontFamily: 'var(--font-main)',
                }}
              >
                <span>
                  Showing search results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#7E3540',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                  <span>Clear Search</span>
                </button>
              </div>
            )}

            {/* Added to Cart Toast Notification */}
            {toastMessage && (
              <div className="shop-cart-toast" role="status" aria-live="polite">
                <span>{toastMessage}</span>
                <Link to="/cart" className="shop-cart-toast-link">
                  View Cart &rarr;
                </Link>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 20px',
                  color: '#7E3540',
                }}
              >
                <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '16px', fontSize: '15px', fontWeight: 500 }}>
                  Loading journals from catalog...
                </p>
              </div>
            ) : errorMessage ? (
              /* Error State */
              <div
                className="shop-empty-state reveal-on-scroll"
                style={{
                  borderColor: '#F87171',
                  backgroundColor: '#FEF2F2',
                }}
              >
                <AlertCircle size={32} color="#DC2626" style={{ marginBottom: '12px' }} />
                <p className="shop-empty-title" style={{ color: '#991B1B' }}>
                  Unable to load products
                </p>
                <p className="shop-empty-subtitle" style={{ color: '#7F1D1D' }}>
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="shop-btn-reset-large"
                >
                  Try Again
                </button>
              </div>
            ) : paginatedProducts.length > 0 ? (
              /* Product Grid (Desktop 3-col, Tablet 2-col, Mobile 1-col) */
              <div className="shop-grid">
                {paginatedProducts.map((product) => {
                  const isAdded = addedProductId === product.id

                  return (
                    <article key={product.id} className="shop-item-card reveal-scale">
                      {/* Product Image Media Container */}
                      <div className="shop-item-media">
                        {product.badge && (
                          <span className="shop-item-badge">{product.badge}</span>
                        )}

                        <Link
                          to={`/product-details/${product.slug}`}
                          className="shop-item-img-link"
                          aria-label={`View details for ${product.name}`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="shop-item-img"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Product Card Details */}
                      <div className="shop-item-body">
                        <h3 className="shop-item-name">
                          <Link to={`/product-details/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h3>

                        <div className="shop-item-price">
                          ₹{product.price.toLocaleString()}
                        </div>

                        {/* ONLY Add to Cart action */}
                        <button
                          type="button"
                          className={`shop-btn-cart ${isAdded ? 'is-added' : ''}`}
                          onClick={() => handleAddToCart(product.id)}
                          aria-live="polite"
                        >
                          {isAdded ? (
                            <>
                              <Check size={16} strokeWidth={2.4} />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} strokeWidth={2} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              /* Friendly Empty State if Filter Excludes Product */
              <div className="shop-empty-state reveal-on-scroll">
                <p className="shop-empty-title">
                  {searchQuery
                    ? `No products match your search for "${searchQuery}".`
                    : 'No products match your selected price range.'}
                </p>
                <p className="shop-empty-subtitle">
                  {searchQuery
                    ? 'Try searching with different keywords or clearing the search to view all journals.'
                    : 'Try adjusting the price slider or resetting filters to see available journals.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="shop-btn-reset-large"
                >
                  Show All Products
                </button>
              </div>
            )}

            {/* Dynamic Pagination - Completely hidden when totalPages <= 1 */}
            {totalPages > 1 && !isLoading && (
              <nav className="shop-pagination reveal-on-scroll" aria-label="Shop Pagination">
                <button
                  type="button"
                  className="shop-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  &larr;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`shop-page-btn ${currentPage === pageNum ? 'is-active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  className="shop-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  &rarr;
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}

export default ShopProduct
