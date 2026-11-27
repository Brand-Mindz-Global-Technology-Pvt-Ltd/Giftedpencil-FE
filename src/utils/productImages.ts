import product1 from '../assets/product/product-1.png'
import product2 from '../assets/product/product-2.png'
import product3 from '../assets/product/product-3.png'
import product4 from '../assets/product/product-4.png'

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'product-1.png': product1,
  'product-2.png': product2,
  'product-3.png': product3,
  'product-4.png': product4,
  'the-gifted-pencil': product1,
}

export const ALL_PRODUCT_IMAGES: string[] = [
  product1,
  product2,
  product3,
  product4,
]

export function resolveProductImage(imageFilename?: string | null): string {
  if (!imageFilename) return product1

  // If already an absolute, blob, or data URL, return directly
  if (
    imageFilename.startsWith('http://') ||
    imageFilename.startsWith('https://') ||
    imageFilename.startsWith('data:') ||
    imageFilename.startsWith('blob:')
  ) {
    return imageFilename
  }

  // If uploaded static file path (e.g., /uploads/products/xyz.png)
  if (imageFilename.startsWith('/uploads/') || imageFilename.startsWith('uploads/')) {
    const cleanPath = imageFilename.startsWith('/') ? imageFilename : `/${imageFilename}`
    const envBase =
      typeof import.meta !== 'undefined'
        ? import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL
        : ''
    const base =
      envBase ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : '')
    return `${base}${cleanPath}`
  }

  // Extract base filename if a path was passed
  const cleanName = imageFilename.split(/[/\\]/).pop() || imageFilename

  return PRODUCT_IMAGE_MAP[cleanName] || PRODUCT_IMAGE_MAP[imageFilename] || product1
}

export function resolveProductImages(images?: string[] | null, mainImage?: string | null): string[] {
  const resolvedList: string[] = []

  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      if (!img) continue
      const resolved = resolveProductImage(img)
      if (!resolvedList.includes(resolved)) {
        resolvedList.push(resolved)
      }
    }
  }

  if (mainImage) {
    const resolvedMain = resolveProductImage(mainImage)
    if (!resolvedList.includes(resolvedMain)) {
      resolvedList.unshift(resolvedMain)
    }
  }

  // If product has its own images, return only those without injecting unwanted placeholders
  if (resolvedList.length > 0) {
    return resolvedList
  }

  return ALL_PRODUCT_IMAGES
}
