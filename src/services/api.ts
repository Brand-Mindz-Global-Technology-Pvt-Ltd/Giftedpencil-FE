/**
 * Centralized API Service for The Gifted Pencil
 * Connects frontend with Node.js + Express + MySQL modular backend
 */

export const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000'

export const TOKEN_STORAGE_KEY = 'tgp_auth_token'

/**
 * Token Storage Utilities
 */
export function getStoredToken(): string | null {
  try {
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      sessionStorage.getItem(TOKEN_STORAGE_KEY)
    )
  } catch {
    return null
  }
}

export function setStoredToken(token: string, rememberMe = true): void {
  try {
    if (rememberMe) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    } else {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    // Storage access unavailable
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Storage access unavailable
  }
}

export interface PublicPolicyData {
  title: string
  content: string
  updatedAt: string
}

/**
 * Fetch published policy content from Admin Settings
 * Gracefully returns null if no custom policy is saved or if server is unreachable
 */
export async function fetchPublicPolicy(type: 'privacy' | 'terms' | 'shipping' | 'return-refund'): Promise<PublicPolicyData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/policies/${type}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data?.success && data?.data?.content && data.data.content.trim() !== '') {
      return data.data as PublicPolicyData;
    }
    return null;
  } catch (err) {
    console.warn(`[fetchPublicPolicy] Failed to load ${type} policy:`, err);
    return null;
  }
}

/**
 * Structured API Error Class
 */
export interface FieldValidationError {
  field: string
  message: string
}

export class ApiError extends Error {
  public statusCode: number
  public errors?: FieldValidationError[]
  public data?: unknown

  constructor(
    message: string,
    statusCode: number,
    errors?: FieldValidationError[],
    data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
    this.data = data
  }
}

// Global 401 callback listener for session invalidation
let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  token?: string | null
  requireAuth?: boolean
}

/**
 * Centralized HTTP client function supporting GET, POST, PUT, DELETE with Bearer auth
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const method = options.method || 'GET'
  const resolvedToken =
    options.token !== undefined ? options.token : getStoredToken()

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  // Automatically attach Bearer token if available
  if (resolvedToken) {
    headers['Authorization'] = `Bearer ${resolvedToken}`
  } else if (options.requireAuth) {
    throw new ApiError('Authentication required. Please log in.', 401)
  }

  let requestBody: string | undefined
  if (options.body !== undefined && options.body !== null) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(options.body)
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      credentials: 'include',
    })
  } catch (netErr: unknown) {
    const errorMsg =
      netErr instanceof Error && netErr.message
        ? `Unable to connect to server: ${netErr.message}`
        : 'Network connection failed. Please verify your internet connection.'
    throw new ApiError(errorMsg, 0)
  }

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    removeStoredToken()
    if (unauthorizedHandler) {
      unauthorizedHandler()
    }
  }

  // Parse JSON or text response
  let responseData: any = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }
  } else {
    try {
      const text = await response.text()
      responseData = text ? { message: text } : null
    } catch {
      responseData = null
    }
  }

  if (!response.ok) {
    let errorMessage =
      responseData?.message ||
      responseData?.error ||
      `Request failed with status ${response.status}`

    let fieldErrors: FieldValidationError[] | undefined
    if (Array.isArray(responseData?.errors)) {
      const errorsList = responseData.errors as FieldValidationError[]
      fieldErrors = errorsList
      if (!responseData?.message && errorsList.length > 0 && errorsList[0]?.message) {
        errorMessage = errorsList[0].message
      }
    }

    throw new ApiError(errorMessage, response.status, fieldErrors, responseData)
  }

  return responseData as T
}

/**
 * Domain-Specific Authentication Types
 */
export interface SafeUser {
  id: string
  user_uuid?: string
  name: string
  email: string
  phone: string
  gender: 'female' | 'male' | 'prefer_not_to_say' | string
  avatar_url?: string
  preferences?: {
    newsletter_subscribed?: boolean
    sms_updates?: boolean
    favorite_categories?: string[]
  }
  account_status?: 'active' | 'inactive' | 'suspended'
  created_at?: string
  updated_at?: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  gender?: 'female' | 'male' | 'prefer_not_to_say' | string
  password: string
  confirmPassword: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  status: 'success'
  message: string
  token: string
  token_type: string
  expires_in: string
  user: SafeUser
}

export interface RegisterResponse {
  status: 'success'
  message: string
  user: SafeUser
}

export interface ForgotPasswordResponse {
  status: 'success'
  success: boolean
  message: string
  dev_reset_token?: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface GenericSuccessResponse {
  status: 'success'
  message: string
}

/**
 * Authentication API Service Client
 */
export const authApi = {
  /**
   * POST /api/auth/register
   */
  register: (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
  },

  /**
   * POST /api/auth/login
   */
  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
  },

  /**
   * POST /api/auth/logout
   */
  logout: (): Promise<GenericSuccessResponse> => {
    return apiRequest<GenericSuccessResponse>('/api/auth/logout', {
      method: 'POST',
      requireAuth: true,
    })
  },

  /**
   * GET /api/auth/me
   */
  getMe: (): Promise<{ status: 'success'; user: SafeUser }> => {
    return apiRequest<{ status: 'success'; user: SafeUser }>('/api/auth/me', {
      method: 'GET',
      requireAuth: true,
    })
  },

  /**
   * POST /api/auth/forgot-password
   */
  forgotPassword: (email: string): Promise<ForgotPasswordResponse> => {
    return apiRequest<ForgotPasswordResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  },

  /**
   * POST /api/auth/reset-password
   */
  resetPassword: (payload: ResetPasswordPayload): Promise<GenericSuccessResponse> => {
    return apiRequest<GenericSuccessResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: payload,
    })
  },
}

/**
 * Product & Catalog Types matching modular backend contract
 */
export interface ProductData {
  id: number
  slug: string
  name: string
  subtitle?: string
  eyebrow?: string
  price: number
  original_price?: number | null
  discount?: string | null
  description: string
  image: string
  images?: string[]
  stock?: number
  in_stock?: boolean
  category?: string
  features?: string[]
  specifications?: Record<string, string>
}

export interface ProductsQueryOptions {
  search?: string
  category?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  sort_by?: string
  page?: number
  limit?: number
}

export interface PaginatedProductsResponse {
  status: string
  data: {
    products: ProductData[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      total_pages?: number
      has_next?: boolean
      has_prev?: boolean
    }
  }
}

export interface SingleProductResponse {
  status: string
  data: {
    product: ProductData
  }
}

export const productsApi = {
  /**
   * Get products with optional search, filter, and pagination
   */
  async getProducts(options: ProductsQueryOptions = {}): Promise<{
    products: ProductData[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const params = new URLSearchParams()
    if (options.search?.trim()) params.append('search', options.search.trim())
    if (options.category?.trim()) params.append('category', options.category.trim())
    if (options.min_price !== undefined) params.append('min_price', String(options.min_price))
    if (options.max_price !== undefined) params.append('max_price', String(options.max_price))
    if (options.in_stock !== undefined) params.append('in_stock', String(options.in_stock))
    if (options.sort_by?.trim()) params.append('sort_by', options.sort_by.trim())
    if (options.page !== undefined) params.append('page', String(options.page))
    if (options.limit !== undefined) params.append('limit', String(options.limit))

    const queryString = params.toString()
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`

    const rawData = await apiRequest<any>(endpoint)

    // Handle envelope formats gracefully
    const productsArray = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data?.products)
        ? rawData.data.products
        : Array.isArray(rawData?.products)
          ? rawData.products
          : []

    const mappedProducts: ProductData[] = productsArray.map((p: any) => ({
      id: Number(p.id),
      slug: String(p.slug || `product-${p.id}`),
      name: String(p.name || ''),
      subtitle: p.subtitle ? String(p.subtitle) : undefined,
      eyebrow: p.eyebrow ? String(p.eyebrow) : undefined,
      price: typeof p.price === 'string' ? parseFloat(p.price) || 0 : Number(p.price) || 0,
      original_price: p.original_price != null ? Number(p.original_price) : null,
      discount: p.discount ? String(p.discount) : null,
      description: String(p.description || ''),
      image: String(p.image || ''),
      images: Array.isArray(p.images) ? p.images.map(String) : undefined,
      stock: p.stock != null ? Number(p.stock) : undefined,
      in_stock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
      category: p.category ? String(p.category) : undefined,
      features: Array.isArray(p.features) ? p.features.map(String) : undefined,
      specifications: p.specifications && typeof p.specifications === 'object' ? p.specifications : undefined,
    }))

    const paginationData = rawData?.data?.pagination || rawData?.pagination || {}
    const pagination = {
      page: Number(paginationData.page || options.page || 1),
      limit: Number(paginationData.limit || options.limit || mappedProducts.length || 10),
      total: Number(paginationData.total ?? mappedProducts.length),
      totalPages: Number(paginationData.totalPages || paginationData.total_pages || Math.ceil(mappedProducts.length / (options.limit || 10)) || 1),
    }

    return {
      products: mappedProducts,
      pagination,
    }
  },

  /**
   * Get single product by numeric ID or URL slug
   */
  async getProductByIdOrSlug(idOrSlug: string | number): Promise<ProductData> {
    const rawData = await apiRequest<any>(`/api/products/${encodeURIComponent(String(idOrSlug))}`)

    // Handle envelope { data: { product } }, { product }, or direct product object
    const productItem = rawData?.data?.product || rawData?.product || rawData

    if (!productItem || !productItem.name) {
      throw new ApiError('Product not found', 404)
    }

    return {
      id: Number(productItem.id),
      slug: String(productItem.slug || `product-${productItem.id}`),
      name: String(productItem.name || ''),
      subtitle: productItem.subtitle ? String(productItem.subtitle) : undefined,
      eyebrow: productItem.eyebrow ? String(productItem.eyebrow) : undefined,
      price: typeof productItem.price === 'string' ? parseFloat(productItem.price) || 0 : Number(productItem.price) || 0,
      original_price: productItem.original_price != null ? Number(productItem.original_price) : null,
      discount: productItem.discount ? String(productItem.discount) : null,
      description: String(productItem.description || ''),
      image: String(productItem.image || ''),
      images: Array.isArray(productItem.images) ? productItem.images.map(String) : undefined,
      stock: productItem.stock != null ? Number(productItem.stock) : undefined,
      in_stock: productItem.in_stock !== undefined ? Boolean(productItem.in_stock) : true,
      category: productItem.category ? String(productItem.category) : undefined,
      features: Array.isArray(productItem.features) ? productItem.features.map(String) : undefined,
      specifications: productItem.specifications && typeof productItem.specifications === 'object' ? productItem.specifications : undefined,
    }
  },

  /**
   * Get list of categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const rawData = await apiRequest<any>('/api/categories')
      const cats = rawData?.data?.categories || rawData?.categories || []
      return Array.isArray(cats) ? cats.map(String) : []
    } catch {
      return []
    }
  },
}

/**
 * Backend Cart Types & Service
 */
export interface BackendCartItem {
  id: string
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  item_total: number
  image: string
  category?: string
}

export interface BackendCartSummary {
  items: BackendCartItem[]
  total_items: number
  subtotal: number
  shipping_fee: number
  free_shipping_threshold: number
  grand_total: number
  currency: string
}

export interface CartResponseEnvelope {
  status: 'success' | 'error'
  cart: BackendCartSummary
  message?: string
}

export const cartApi = {
  /**
   * GET /api/cart
   * Retrieves server-calculated cart summary for authenticated user or guest session
   */
  async getCart(): Promise<BackendCartSummary> {
    const raw = await apiRequest<any>('/api/cart')
    const cart = raw?.cart || raw?.data?.cart || raw
    return {
      items: Array.isArray(cart?.items) ? cart.items : [],
      total_items: Number(cart?.total_items || 0),
      subtotal: Number(cart?.subtotal || 0),
      shipping_fee: Number(cart?.shipping_fee || 0),
      free_shipping_threshold: Number(cart?.free_shipping_threshold || 499),
      grand_total: Number(cart?.grand_total || 0),
      currency: String(cart?.currency || 'INR'),
    }
  },

  /**
   * POST /api/cart/items
   * Add a product to cart with backend price & stock validation
   */
  async addItem(productId: number, quantity = 1): Promise<{ message: string; cart: BackendCartSummary }> {
    const raw = await apiRequest<any>('/api/cart/items', {
      method: 'POST',
      body: {
        product_id: Number(productId),
        quantity: Number(quantity),
      },
    })
    const cart = raw?.cart || raw?.data?.cart || raw
    return {
      message: String(raw?.message || 'Item added to cart'),
      cart: {
        items: Array.isArray(cart?.items) ? cart.items : [],
        total_items: Number(cart?.total_items || 0),
        subtotal: Number(cart?.subtotal || 0),
        shipping_fee: Number(cart?.shipping_fee || 0),
        free_shipping_threshold: Number(cart?.free_shipping_threshold || 499),
        grand_total: Number(cart?.grand_total || 0),
        currency: String(cart?.currency || 'INR'),
      },
    }
  },

  /**
   * PUT /api/cart/items/:id
   * Update item quantity (pass 0 to remove)
   */
  async updateQuantity(productId: number, quantity: number): Promise<{ message: string; cart: BackendCartSummary }> {
    const raw = await apiRequest<any>(`/api/cart/items/${encodeURIComponent(String(productId))}`, {
      method: 'PUT',
      body: {
        quantity: Number(quantity),
      },
    })
    const cart = raw?.cart || raw?.data?.cart || raw
    return {
      message: String(raw?.message || 'Cart updated'),
      cart: {
        items: Array.isArray(cart?.items) ? cart.items : [],
        total_items: Number(cart?.total_items || 0),
        subtotal: Number(cart?.subtotal || 0),
        shipping_fee: Number(cart?.shipping_fee || 0),
        free_shipping_threshold: Number(cart?.free_shipping_threshold || 499),
        grand_total: Number(cart?.grand_total || 0),
        currency: String(cart?.currency || 'INR'),
      },
    }
  },

  /**
   * DELETE /api/cart/items/:id
   * Remove item from cart
   */
  async removeItem(productId: number): Promise<{ message: string; cart: BackendCartSummary }> {
    const raw = await apiRequest<any>(`/api/cart/items/${encodeURIComponent(String(productId))}`, {
      method: 'DELETE',
    })
    const cart = raw?.cart || raw?.data?.cart || raw
    return {
      message: String(raw?.message || 'Item removed from cart'),
      cart: {
        items: Array.isArray(cart?.items) ? cart.items : [],
        total_items: Number(cart?.total_items || 0),
        subtotal: Number(cart?.subtotal || 0),
        shipping_fee: Number(cart?.shipping_fee || 0),
        free_shipping_threshold: Number(cart?.free_shipping_threshold || 499),
        grand_total: Number(cart?.grand_total || 0),
        currency: String(cart?.currency || 'INR'),
      },
    }
  },

  /**
   * DELETE /api/cart
   * Clear all items in cart
   */
  async clearCart(): Promise<{ message: string; cart: BackendCartSummary }> {
    const raw = await apiRequest<any>('/api/cart', {
      method: 'DELETE',
    })
    const cart = raw?.cart || raw?.data?.cart || raw
    return {
      message: String(raw?.message || 'Cart cleared'),
      cart: {
        items: Array.isArray(cart?.items) ? cart.items : [],
        total_items: Number(cart?.total_items || 0),
        subtotal: Number(cart?.subtotal || 0),
        shipping_fee: Number(cart?.shipping_fee || 0),
        free_shipping_threshold: Number(cart?.free_shipping_threshold || 499),
        grand_total: Number(cart?.grand_total || 0),
        currency: String(cart?.currency || 'INR'),
      },
    }
  },
}

/**
 * Backend Address Types & Service
 */
export interface BackendAddress {
  id: string
  user_id?: string
  userId?: string
  customer_name: string
  name?: string
  phone: string
  email?: string
  pincode: string
  house_details: string
  street?: string
  street_area: string
  colony?: string
  landmark?: string
  city: string
  state: string
  tag: 'Home' | 'Work' | 'Other' | string
  is_default?: boolean
  isDefault?: boolean
  addressLine?: string
  created_at?: string
  updated_at?: string
}

export interface AddressInputPayload {
  customer_name?: string
  name?: string
  phone: string
  email?: string
  pincode: string
  house_details?: string
  street?: string
  street_area?: string
  colony?: string
  landmark?: string
  city: string
  state: string
  tag?: 'Home' | 'Work' | 'Other' | string
  is_default?: boolean
  isDefault?: boolean
}

export const addressApi = {
  /**
   * GET /api/addresses
   * List all saved addresses for the authenticated user
   */
  async getAddresses(): Promise<BackendAddress[]> {
    const raw = await apiRequest<any>('/api/addresses', {
      requireAuth: true,
    })
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data?.addresses)
        ? raw.data.addresses
        : Array.isArray(raw?.addresses)
          ? raw.addresses
          : []

    return list.map((a: any) => ({
      id: String(a.id),
      user_id: a.user_id ? String(a.user_id) : undefined,
      userId: a.userId ? String(a.userId) : undefined,
      customer_name: String(a.customer_name || a.name || ''),
      name: String(a.customer_name || a.name || ''),
      phone: String(a.phone || ''),
      email: a.email ? String(a.email) : undefined,
      pincode: String(a.pincode || ''),
      house_details: String(a.house_details || a.street || ''),
      street: String(a.house_details || a.street || ''),
      street_area: String(a.street_area || a.colony || ''),
      colony: String(a.street_area || a.colony || ''),
      landmark: a.landmark ? String(a.landmark) : undefined,
      city: String(a.city || ''),
      state: String(a.state || ''),
      tag: a.tag || 'Home',
      is_default: Boolean(a.is_default !== undefined ? a.is_default : a.isDefault),
      isDefault: Boolean(a.is_default !== undefined ? a.is_default : a.isDefault),
      addressLine: a.addressLine
        ? String(a.addressLine)
        : `${a.house_details || a.street || ''}, ${a.street_area || a.colony || ''}, ${a.city || ''}, ${a.state || ''} – ${a.pincode || ''}`,
      created_at: a.created_at ? String(a.created_at) : undefined,
      updated_at: a.updated_at ? String(a.updated_at) : undefined,
    }))
  },

  /**
   * POST /api/addresses
   * Save a new address for the authenticated user
   */
  async createAddress(input: AddressInputPayload): Promise<BackendAddress> {
    const raw = await apiRequest<any>('/api/addresses', {
      method: 'POST',
      body: input,
      requireAuth: true,
    })
    const addr = raw?.data?.address || raw?.address || raw
    return {
      id: String(addr.id),
      customer_name: String(addr.customer_name || addr.name || ''),
      name: String(addr.customer_name || addr.name || ''),
      phone: String(addr.phone || ''),
      email: addr.email ? String(addr.email) : undefined,
      pincode: String(addr.pincode || ''),
      house_details: String(addr.house_details || addr.street || ''),
      street: String(addr.house_details || addr.street || ''),
      street_area: String(addr.street_area || addr.colony || ''),
      colony: String(addr.street_area || addr.colony || ''),
      landmark: addr.landmark ? String(addr.landmark) : undefined,
      city: String(addr.city || ''),
      state: String(addr.state || ''),
      tag: addr.tag || 'Home',
      is_default: Boolean(addr.is_default !== undefined ? addr.is_default : addr.isDefault),
      isDefault: Boolean(addr.is_default !== undefined ? addr.is_default : addr.isDefault),
      addressLine: addr.addressLine
        ? String(addr.addressLine)
        : `${addr.house_details || addr.street || ''}, ${addr.street_area || addr.colony || ''}, ${addr.city || ''}, ${addr.state || ''} – ${addr.pincode || ''}`,
    }
  },

  /**
   * PUT /api/addresses/:id
   * Update an existing address for the authenticated user
   */
  async updateAddress(id: string, input: Partial<AddressInputPayload>): Promise<BackendAddress> {
    const raw = await apiRequest<any>(`/api/addresses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
      requireAuth: true,
    })
    const addr = raw?.data?.address || raw?.address || raw
    return {
      id: String(addr.id),
      customer_name: String(addr.customer_name || addr.name || ''),
      name: String(addr.customer_name || addr.name || ''),
      phone: String(addr.phone || ''),
      email: addr.email ? String(addr.email) : undefined,
      pincode: String(addr.pincode || ''),
      house_details: String(addr.house_details || addr.street || ''),
      street: String(addr.house_details || addr.street || ''),
      street_area: String(addr.street_area || addr.colony || ''),
      colony: String(addr.street_area || addr.colony || ''),
      landmark: addr.landmark ? String(addr.landmark) : undefined,
      city: String(addr.city || ''),
      state: String(addr.state || ''),
      tag: addr.tag || 'Home',
      is_default: Boolean(addr.is_default !== undefined ? addr.is_default : addr.isDefault),
      isDefault: Boolean(addr.is_default !== undefined ? addr.is_default : addr.isDefault),
      addressLine: addr.addressLine
        ? String(addr.addressLine)
        : `${addr.house_details || addr.street || ''}, ${addr.street_area || addr.colony || ''}, ${addr.city || ''}, ${addr.state || ''} – ${addr.pincode || ''}`,
    }
  },

  /**
   * PUT /api/addresses/:id/default
   * Mark address as default
   */
  async setDefaultAddress(id: string): Promise<BackendAddress> {
    const raw = await apiRequest<any>(`/api/addresses/${encodeURIComponent(id)}/default`, {
      method: 'PUT',
      requireAuth: true,
    })
    const addr = raw?.data?.address || raw?.address || raw
    return {
      id: String(addr.id),
      customer_name: String(addr.customer_name || addr.name || ''),
      name: String(addr.customer_name || addr.name || ''),
      phone: String(addr.phone || ''),
      email: addr.email ? String(addr.email) : undefined,
      pincode: String(addr.pincode || ''),
      house_details: String(addr.house_details || addr.street || ''),
      street_area: String(addr.street_area || addr.colony || ''),
      city: String(addr.city || ''),
      state: String(addr.state || ''),
      tag: addr.tag || 'Home',
      is_default: true,
      isDefault: true,
    }
  },

  /**
   * DELETE /api/addresses/:id
   * Delete an address
   */
  async deleteAddress(id: string): Promise<void> {
    await apiRequest<any>(`/api/addresses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      requireAuth: true,
    })
  },
}

/**
 * Backend Order Types & Service
 */
export interface BackendOrderItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
  total_price: number
  image?: string
}

export interface BackendOrderDeliverySnapshot {
  customer_name: string
  phone: string
  email?: string
  house_details: string
  street_area: string
  landmark?: string
  city: string
  state: string
  pincode: string
  addressLine?: string
}

export interface BackendOrder {
  id: string | number
  order_reference: string
  user_id?: string | number | null
  customer_name: string
  phone: string
  email?: string
  address: string
  city?: string
  state?: string
  pincode?: string
  delivery_address_snapshot?: BackendOrderDeliverySnapshot
  delivery_address?: BackendOrderDeliverySnapshot
  items: BackendOrderItem[]
  subtotal: number
  shipping_fee: number
  discount_amount?: number
  total_price: number
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled' | string
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | string
  payment_method: string
  courier_name?: string
  tracking_number?: string
  dispatched_at?: string
  delivered_at?: string
  created_at: string
  updated_at?: string
}

export interface CheckoutOrderPayload {
  address_id?: string
  customer_name?: string
  phone?: string
  email?: string
  house_details?: string
  street_area?: string
  landmark?: string
  city?: string
  state?: string
  pincode?: string
  address?: string
  payment_method?: 'Online' | 'COD' | 'Card' | 'UPI' | 'NetBanking' | string
  items?: Array<{
    product_id: number
    quantity: number
  }>
}

export interface QuickOrderPayload {
  product_id: number
  customer_name: string
  phone: string
  address: string
  quantity: number
  payment_method?: string
}

export interface OrderTrackingInfo {
  order_reference: string
  order_status: string
  payment_status: string
  payment_method: string
  destination_city?: string
  destination_state?: string
  delivery_city?: string
  delivery_state?: string
  created_at: string
  dispatched_at?: string
  delivered_at?: string
  courier_name?: string
  tracking_number?: string
  items: Array<{
    product_name: string
    quantity: number
  }>
}

export const ordersApi = {
  /**
   * POST /api/orders/checkout
   * Checkout order from cart or multi-item payload with backend price/stock validation
   */
  async checkout(payload: CheckoutOrderPayload = {}): Promise<BackendOrder> {
    const raw = await apiRequest<any>('/api/orders/checkout', {
      method: 'POST',
      body: payload,
    })
    const order = raw?.data?.order || raw?.order || raw
    return order as BackendOrder
  },

  /**
   * POST /api/orders
   * Place quick single-item order
   */
  async placeQuickOrder(payload: QuickOrderPayload): Promise<BackendOrder> {
    const raw = await apiRequest<any>('/api/orders', {
      method: 'POST',
      body: payload,
    })
    const order = raw?.data?.order || raw?.order || raw
    return order as BackendOrder
  },

  /**
   * GET /api/orders/my-orders
   * List orders for authenticated user
   */
  async getMyOrders(): Promise<BackendOrder[]> {
    const raw = await apiRequest<any>('/api/orders/my-orders', {
      requireAuth: true,
    })
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data?.orders)
        ? raw.data.orders
        : Array.isArray(raw?.orders)
          ? raw.orders
          : []
    return list as BackendOrder[]
  },

  /**
   * GET /api/orders/:id
   * Get full order details by ID
   */
  async getOrderDetails(orderId: string | number): Promise<BackendOrder> {
    const raw = await apiRequest<any>(`/api/orders/${encodeURIComponent(String(orderId))}`, {
      requireAuth: true,
    })
    const order = raw?.data?.order || raw?.order || raw
    return order as BackendOrder
  },

  /**
   * GET /api/orders/track/:orderRef
   * Track order by reference code and customer phone
   */
  async trackOrder(orderRef: string, phone: string): Promise<OrderTrackingInfo> {
    const query = new URLSearchParams({ phone: phone.trim() }).toString()
    const raw = await apiRequest<any>(`/api/orders/track/${encodeURIComponent(orderRef)}?${query}`)
    const tracking = raw?.data?.tracking || raw?.order || raw
    return tracking as OrderTrackingInfo
  },
}

/**
 * Backend Profile Types & Service
 */
export interface BackendUserProfile {
  id: string | number
  name: string
  full_name?: string
  email: string
  phone: string
  gender?: string
  avatar_url?: string
  joined_date?: string
  created_at?: string
  updated_at?: string
  preferences?: {
    newsletter_subscribed?: boolean
    sms_updates?: boolean
    favorite_categories?: string[]
  }
}

export interface UpdateProfilePayload {
  name?: string
  full_name?: string
  fullName?: string
  email?: string
  phone?: string
  gender?: string
  avatar_url?: string
  photoUrl?: string
  preferences?: {
    newsletter_subscribed?: boolean
    sms_updates?: boolean
    favorite_categories?: string[]
  }
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

export interface BackendWishlistItem {
  id: string
  product_id: number
  product_name: string
  name?: string
  title?: string
  price: number
  original_price?: number
  discount?: string
  image: string
  slug: string
  category?: string
  in_stock: boolean
  added_at?: string
}

export interface BackendWishlistSummary {
  items: BackendWishlistItem[]
  total_items: number
}

export const profileApi = {
  /**
   * GET /api/profile
   * Return authenticated user profile
   */
  async getProfile(): Promise<BackendUserProfile> {
    const raw = await apiRequest<any>('/api/profile', {
      requireAuth: true,
    })
    const profile = raw?.data?.profile || raw?.profile || raw
    return profile as BackendUserProfile
  },

  /**
   * PUT /api/profile
   * Update authenticated user profile details
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<BackendUserProfile> {
    const raw = await apiRequest<any>('/api/profile', {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    })
    const profile = raw?.data?.profile || raw?.profile || raw
    return profile as BackendUserProfile
  },

  /**
   * PUT /api/profile/password
   * Change authenticated user password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const raw = await apiRequest<any>('/api/profile/password', {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    })
    return {
      message: String(raw?.message || 'Password changed successfully.'),
    }
  },
}

export const wishlistApi = {
  /**
   * GET /api/wishlist
   * Returns full wishlist summary for authenticated user
   */
  async getWishlist(): Promise<BackendWishlistSummary> {
    const raw = await apiRequest<any>('/api/wishlist', {
      method: 'GET',
      requireAuth: true,
    })
    const wishlist = raw?.wishlist || raw?.data?.wishlist || raw
    return {
      items: Array.isArray(wishlist?.items) ? wishlist.items : [],
      total_items: Number(wishlist?.total_items || (Array.isArray(wishlist?.items) ? wishlist.items.length : 0)),
    }
  },

  /**
   * POST /api/wishlist
   * Adds product to authenticated user's wishlist
   */
  async addItem(productId: number): Promise<{ message: string; item?: BackendWishlistItem; wishlist: BackendWishlistSummary }> {
    const raw = await apiRequest<any>('/api/wishlist', {
      method: 'POST',
      body: {
        product_id: Number(productId),
      },
      requireAuth: true,
    })
    const wishlist = raw?.wishlist || raw?.data?.wishlist || {}
    return {
      message: String(raw?.message || 'Added to wishlist'),
      item: raw?.item || raw?.data?.item,
      wishlist: {
        items: Array.isArray(wishlist?.items) ? wishlist.items : [],
        total_items: Number(wishlist?.total_items || (Array.isArray(wishlist?.items) ? wishlist.items.length : 0)),
      },
    }
  },

  /**
   * DELETE /api/wishlist/:productId
   * Removes single product from authenticated user's wishlist
   */
  async removeItem(productId: number): Promise<{ message: string; wishlist: BackendWishlistSummary }> {
    const raw = await apiRequest<any>(`/api/wishlist/${encodeURIComponent(String(productId))}`, {
      method: 'DELETE',
      requireAuth: true,
    })
    const wishlist = raw?.wishlist || raw?.data?.wishlist || {}
    return {
      message: String(raw?.message || 'Item removed from wishlist'),
      wishlist: {
        items: Array.isArray(wishlist?.items) ? wishlist.items : [],
        total_items: Number(wishlist?.total_items || (Array.isArray(wishlist?.items) ? wishlist.items.length : 0)),
      },
    }
  },

  /**
   * DELETE /api/wishlist
   * Clears entire wishlist for authenticated user
   */
  async clearWishlist(): Promise<{ message: string; wishlist: BackendWishlistSummary }> {
    const raw = await apiRequest<any>('/api/wishlist', {
      method: 'DELETE',
      requireAuth: true,
    })
    const wishlist = raw?.wishlist || raw?.data?.wishlist || {}
    return {
      message: String(raw?.message || 'Wishlist cleared'),
      wishlist: {
        items: Array.isArray(wishlist?.items) ? wishlist.items : [],
        total_items: Number(wishlist?.total_items || (Array.isArray(wishlist?.items) ? wishlist.items.length : 0)),
      },
    }
  },

  /**
   * POST /api/wishlist/move-to-cart/:productId
   * Moves item from wishlist to cart
   */
  async moveToCart(productId: number, quantity = 1): Promise<{ message: string; cart?: BackendCartSummary; wishlist: BackendWishlistSummary }> {
    const raw = await apiRequest<any>(`/api/wishlist/move-to-cart/${encodeURIComponent(String(productId))}`, {
      method: 'POST',
      body: {
        quantity: Number(quantity),
      },
      requireAuth: true,
    })
    const wishlist = raw?.wishlist || raw?.data?.wishlist || {}
    return {
      message: String(raw?.message || 'Moved to cart'),
      cart: raw?.cart || raw?.data?.cart,
      wishlist: {
        items: Array.isArray(wishlist?.items) ? wishlist.items : [],
        total_items: Number(wishlist?.total_items || (Array.isArray(wishlist?.items) ? wishlist.items.length : 0)),
      },
    }
  },
}

/**
 * Backward-Compatible Product & Order Types
 */
export interface ApiProduct {
  id: number
  slug?: string
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

export interface ContactPayload {
  name?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  subject?: string
  enquiryType?: string
  enquiry_type?: string
  message: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  enquiry_type?: string
  status: string
  created_at: string
}

export const contactApi = {
  /**
   * POST /api/contact
   * Submit enquiry
   */
  async submitContact(payload: ContactPayload): Promise<{ message: string; contact: ContactSubmission }> {
    const raw = await apiRequest<any>('/api/contact', {
      method: 'POST',
      body: payload,
    })
    return {
      message: String(raw?.message || 'Thank you for reaching out! Your message has been received.'),
      contact: (raw?.contact || raw?.data?.contact || raw) as ContactSubmission,
    }
  },
}

/**
 * Fetch products (backward-compatible with both array and envelope formats)
 */
export async function getProducts(): Promise<ApiProduct[]> {
  try {
    const rawData = await apiRequest<any>('/api/products')
    // Handle both { data: { products: [...] } } and direct [...] array
    const productList = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data?.products)
        ? rawData.data.products
        : Array.isArray(rawData?.products)
          ? rawData.products
          : []

    return productList.map((item: any) => ({
      id: Number(item.id),
      slug: item.slug ? String(item.slug) : undefined,
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
 * Place a new order via POST /api/orders (backward-compatible)
 */
export async function placeOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderSuccessResponse> {
  try {
    const data = await apiRequest<CreateOrderSuccessResponse>('/api/orders', {
      method: 'POST',
      body: {
        product_id: Number(payload.product_id),
        customer_name: payload.customer_name.trim(),
        phone: payload.phone.trim(),
        address: payload.address.trim(),
        quantity: Number(payload.quantity),
      },
    })
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected network error occurred while submitting your order.')
  }
}

export default {
  apiRequest,
  authApi,
  productsApi,
  cartApi,
  addressApi,
  ordersApi,
  profileApi,
  wishlistApi,
  contactApi,
  getProducts,
  placeOrder,
  API_BASE_URL,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
}
