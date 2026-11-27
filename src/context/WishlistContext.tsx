/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import {
  wishlistApi,
  type BackendWishlistItem,
  type BackendWishlistSummary,
} from '../services/api'
import { resolveProductImage } from '../utils/productImages'
import { useAuth } from './AuthContext'

export interface WishlistItem {
  id: string | number
  productId: number
  title: string
  description?: string
  price: number
  originalPrice?: number
  discountPercent?: number
  image: string
  slug?: string
  inStock?: boolean
}

interface WishlistContextType {
  items: WishlistItem[]
  wishlistCount: number
  isLoading: boolean
  wishlistError: string | null
  addToWishlist: (item: WishlistItem | { id: string | number; title?: string; name?: string; price?: number; image?: string; slug?: string; description?: string }) => Promise<void>
  removeFromWishlist: (idOrProductId: string | number) => Promise<void>
  toggleWishlist: (item: WishlistItem | { id: string | number; title?: string; name?: string; price?: number; image?: string; slug?: string; description?: string }) => Promise<void>
  isInWishlist: (idOrProductId: string | number) => boolean
  clearWishlist: () => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

/**
 * Extract integer product ID from item ID, slug, or number
 */
function extractProductId(id: number | string): number {
  if (typeof id === 'number' && !isNaN(id) && id > 0) {
    return id
  }
  const str = String(id).trim()
  const num = parseInt(str.replace(/\D/g, ''), 10)
  if (!isNaN(num) && num > 0) {
    return num
  }
  // Default fallback
  return 1
}

function mapBackendWishlistItemToFrontend(item: BackendWishlistItem): WishlistItem {
  const discountVal = item.discount
    ? parseInt(String(item.discount).replace(/\D/g, ''), 10) || undefined
    : undefined

  return {
    id: item.id || `WISH-${item.product_id}`,
    productId: Number(item.product_id),
    title: item.title || item.name || item.product_name || 'The Gifted Pencil',
    description: item.category ? `${item.category} • Mindful Journal` : undefined,
    price: Number(item.price || 0),
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    discountPercent: discountVal,
    image: resolveProductImage(item.image),
    slug: item.slug || 'the-gifted-pencil',
    inStock: item.in_stock !== false,
  }
}

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wishlistError, setWishlistError] = useState<string | null>(null)

  // Track in-flight operations to prevent concurrent duplicate requests
  const pendingRequestsRef = useRef<Set<number>>(new Set())

  // Apply backend summary to state
  const applyWishlistSummary = useCallback((summary: BackendWishlistSummary) => {
    const mapped = summary.items.map(mapBackendWishlistItemToFrontend)
    setItems(mapped)
  }, [])

  // Fetch live wishlist for authenticated user
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setIsLoading(false)
      return
    }

    setWishlistError(null)
    try {
      const summary = await wishlistApi.getWishlist()
      applyWishlistSummary(summary)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize wishlist with server'
      setWishlistError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, applyWishlistSummary])

  // Synchronize with auth state: reset on unauthenticated/logout, load on login
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return

    let ignore = false

    wishlistApi
      .getWishlist()
      .then((summary) => {
        if (!ignore) {
          applyWishlistSummary(summary)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Failed to load wishlist'
          setWishlistError(msg)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [isAuthenticated, isAuthLoading, applyWishlistSummary])

  // Explicitly clear in-memory items when user logs out
  const prevAuthRef = useRef(isAuthenticated)
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      setItems([])
      setIsLoading(false)
      setWishlistError(null)
    }
    prevAuthRef.current = isAuthenticated
  }, [isAuthenticated])

  const isInWishlist = useCallback(
    (idOrProductId: string | number): boolean => {
      const targetStr = String(idOrProductId).trim().toLowerCase()
      const numericTarget = extractProductId(idOrProductId)

      return items.some((item) => {
        if (item.productId === numericTarget) return true
        if (String(item.id).toLowerCase() === targetStr) return true
        if (item.slug && item.slug.toLowerCase() === targetStr) return true
        return false
      })
    },
    [items]
  )

  const addToWishlist = useCallback(
    async (
      rawItem: WishlistItem | { id: string | number; title?: string; name?: string; price?: number; image?: string; slug?: string; description?: string }
    ) => {
      if (!isAuthenticated) {
        return
      }

      const pId = 'productId' in rawItem && typeof rawItem.productId === 'number'
        ? rawItem.productId
        : extractProductId(rawItem.id)

      if (pendingRequestsRef.current.has(pId)) return
      pendingRequestsRef.current.add(pId)

      setWishlistError(null)
      try {
        const result = await wishlistApi.addItem(pId)
        applyWishlistSummary(result.wishlist)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to add item to wishlist'
        setWishlistError(msg)
      } finally {
        pendingRequestsRef.current.delete(pId)
      }
    },
    [isAuthenticated, applyWishlistSummary]
  )

  const removeFromWishlist = useCallback(
    async (idOrProductId: string | number) => {
      if (!isAuthenticated) {
        return
      }

      // Check if item is already in list to find numeric productId
      const targetStr = String(idOrProductId).trim().toLowerCase()
      const existing = items.find(
        (it) =>
          it.productId === extractProductId(idOrProductId) ||
          String(it.id).toLowerCase() === targetStr ||
          (it.slug && it.slug.toLowerCase() === targetStr)
      )

      const pId = existing ? existing.productId : extractProductId(idOrProductId)

      if (pendingRequestsRef.current.has(pId)) return
      pendingRequestsRef.current.add(pId)

      setWishlistError(null)
      try {
        const result = await wishlistApi.removeItem(pId)
        applyWishlistSummary(result.wishlist)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to remove item from wishlist'
        setWishlistError(msg)
      } finally {
        pendingRequestsRef.current.delete(pId)
      }
    },
    [isAuthenticated, items, applyWishlistSummary]
  )

  const toggleWishlist = useCallback(
    async (
      targetItem: WishlistItem | { id: string | number; title?: string; name?: string; price?: number; image?: string; slug?: string; description?: string }
    ) => {
      if (isInWishlist(targetItem.id)) {
        await removeFromWishlist(targetItem.id)
      } else {
        await addToWishlist(targetItem)
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  )

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }

    setWishlistError(null)
    try {
      const result = await wishlistApi.clearWishlist()
      applyWishlistSummary(result.wishlist)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to clear wishlist'
      setWishlistError(msg)
    }
  }, [isAuthenticated, applyWishlistSummary])

  const wishlistCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount,
        isLoading,
        wishlistError,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export default WishlistContext
