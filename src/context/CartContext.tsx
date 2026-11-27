/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { cartApi, type BackendCartSummary, type BackendCartItem } from '../services/api'
import { resolveProductImage } from '../utils/productImages'

export interface CartItem {
  id: number | string
  productId?: number
  name: string
  title?: string
  subtitle?: string
  price: number
  quantity: number
  image: string
  slug?: string
  itemTotal?: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingThreshold: number
  isLoading: boolean
  cartError: string | null
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>
  updateQuantity: (id: number | string, delta: number) => Promise<void>
  removeItem: (id: number | string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'tgp_cart'

/**
 * Map backend item to frontend CartItem interface
 */
function mapBackendItemToFrontend(item: BackendCartItem): CartItem {
  return {
    id: item.product_id, // Map by product_id so quantity delta/remove operates correctly
    productId: item.product_id,
    name: item.product_name,
    title: item.product_name,
    subtitle: item.category || 'Plan • Reflect • Achieve',
    price: Number(item.unit_price),
    quantity: Number(item.quantity),
    image: resolveProductImage(item.image),
    slug: item.product_name
      ? item.product_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : 'the-gifted-pencil',
    itemTotal: Number(item.item_total),
  }
}

/**
 * Helper to extract numeric product ID from cart item or identifier
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
  // Default to product 1 if slug or non-numeric ID passed
  return 1
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial cached items for instant hydration
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored !== null) {
        return JSON.parse(stored) as CartItem[]
      }
    } catch {
      // fallback
    }
    return []
  })

  const [itemCount, setItemCount] = useState<number>(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  })
  const [subtotal, setSubtotal] = useState<number>(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })
  const [shipping, setShipping] = useState<number>(() => {
    const calcSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return calcSubtotal === 0 || calcSubtotal >= 499 ? 0 : 50
  })
  const [total, setTotal] = useState<number>(() => {
    const calcSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const calcShipping = calcSubtotal === 0 || calcSubtotal >= 499 ? 0 : 50
    return calcSubtotal + calcShipping
  })
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(499)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cartError, setCartError] = useState<string | null>(null)

  // Apply server cart summary to state and sync local cache
  const applyCartSummary = (summary: BackendCartSummary) => {
    const mapped = summary.items.map(mapBackendItemToFrontend)
    setItems(mapped)
    setItemCount(summary.total_items)
    setSubtotal(summary.subtotal)
    setShipping(summary.shipping_fee)
    setTotal(summary.grand_total)
    setFreeShippingThreshold(summary.free_shipping_threshold || 499)

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mapped))
    } catch {
      // local storage unavailable
    }
  }

  // Fetch live cart from backend
  const refreshCart = async () => {
    setCartError(null)
    try {
      const summary = await cartApi.getCart()
      applyCartSummary(summary)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to synchronize cart with server'
      setCartError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const initCart = async () => {
      try {
        const summary = await cartApi.getCart()
        if (isMounted) {
          applyCartSummary(summary)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load cart'
          setCartError(msg)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initCart()

    return () => {
      isMounted = false
    }
  }, [])

  const addToCart = async (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity && newItem.quantity > 0 ? newItem.quantity : 1
    const pId = extractProductId(newItem.productId || newItem.id)

    setCartError(null)
    try {
      const res = await cartApi.addItem(pId, qtyToAdd)
      applyCartSummary(res.cart)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add item to cart'
      setCartError(msg)
      throw err
    }
  }

  const updateQuantity = async (id: number | string, delta: number) => {
    const pId = extractProductId(id)
    const currentItem = items.find((item) => extractProductId(item.productId || item.id) === pId)
    const currentQty = currentItem ? currentItem.quantity : 1
    const targetQty = currentQty + delta

    setCartError(null)
    try {
      if (targetQty <= 0) {
        const res = await cartApi.removeItem(pId)
        applyCartSummary(res.cart)
      } else {
        const res = await cartApi.updateQuantity(pId, targetQty)
        applyCartSummary(res.cart)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update item quantity'
      setCartError(msg)
      throw err
    }
  }

  const removeItem = async (id: number | string) => {
    const pId = extractProductId(id)
    setCartError(null)
    try {
      const res = await cartApi.removeItem(pId)
      applyCartSummary(res.cart)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove item from cart'
      setCartError(msg)
      throw err
    }
  }

  const clearCart = async () => {
    setCartError(null)
    try {
      const res = await cartApi.clearCart()
      applyCartSummary(res.cart)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to clear cart'
      setCartError(msg)
      throw err
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        freeShippingThreshold,
        isLoading,
        cartError,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
