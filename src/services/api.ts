/**
 * API Service for The Gifted Pencil
 * Connects frontend with Node.js + Express + MySQL backend
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000'

export interface ApiProduct {
  id: number
  name: string
  price: number | string
  description: string | null
  image: string | null
}

export interface CreateOrderPayload {
  product_id: number
  customer_name: string
  phone: string
  address: string
  quantity: number
}

export interface SavedOrder {
  id: number
  product_id: number
  customer_name: string
  phone: string
  address: string
  quantity: number
  total_price: number | string
  order_status: string
  created_at: string
}

export interface CreateOrderSuccessResponse {
  status: 'success'
  message: string
  order: SavedOrder
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  details?: string
}

/**
 * Fetch all products from GET /api/products
 */
export async function getProducts(): Promise<ApiProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = `Unable to load products (HTTP ${response.status})`
      try {
        const errorData: ApiErrorResponse = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // Response was not JSON
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      return []
    }

    return data.map((item) => ({
      id: Number(item.id),
      name: String(item.name || ''),
      price:
        typeof item.price === 'string'
          ? parseFloat(item.price) || 0
          : Number(item.price) || 0,
      description: item.description ?? null,
      image: item.image ?? null,
    }))
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred while fetching products.')
  }
}

/**
 * Place a new order via POST /api/orders
 */
export async function placeOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderSuccessResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        product_id: Number(payload.product_id),
        customer_name: payload.customer_name.trim(),
        phone: payload.phone.trim(),
        address: payload.address.trim(),
        quantity: Number(payload.quantity),
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok || !data || data.status !== 'success') {
      const serverMessage =
        data?.message ||
        data?.details ||
        `Order submission failed (HTTP ${response.status})`
      throw new Error(serverMessage)
    }

    return data as CreateOrderSuccessResponse
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected network error occurred while submitting your order.')
  }
}

export default {
  getProducts,
  placeOrder,
  API_BASE_URL,
}
