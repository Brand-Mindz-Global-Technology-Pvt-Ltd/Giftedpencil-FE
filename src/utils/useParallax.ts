import { useEffect } from 'react'

/**
 * Modern Interactive Motion - True Multi-Layer Parallax Engine
 *
 * Drives genuine scroll-linked multi-layer depth across designated elements:
 * - Background layers (banners): move slower than page scroll (e.g. speed: -0.22).
 * - Midground layers (story/feature images): move relative to their parent frames (e.g. speed: 0.10).
 * - Foreground layers (badges, floating highlights, cards): float with independent depth (e.g. speed: -0.06 to -0.10).
 *
 * Hardware-accelerated with requestAnimationFrame, passive scroll listeners,
 * viewport clipping checks, and full reduced-motion & mobile awareness.
 */
export function useParallax(dependencyKey?: unknown) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>('[data-parallax-speed], .parallax-layer').forEach((el) => {
        el.style.removeProperty('--parallax-y')
        el.style.removeProperty('--parallax-scale')
      })
      return
    }

    let rafId: number | null = null
    let isTicking = false

    const updateParallax = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-parallax-speed], .parallax-layer')
      if (!elements.length) {
        isTicking = false
        return
      }

      const viewportHeight = window.innerHeight
      const viewportCenter = viewportHeight / 2
      const isMobile = window.innerWidth < 768
      const mobileFactor = isMobile ? 0.45 : 1

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // Skip elements outside viewport buffer
        if (rect.bottom < -120 || rect.top > viewportHeight + 120) {
          return
        }

        const elementCenter = rect.top + rect.height / 2
        const distanceFromCenter = elementCenter - viewportCenter
        const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.1')
        const maxOffset = parseFloat(el.getAttribute('data-parallax-max') || '75')
        const rawScale = el.getAttribute('data-parallax-scale')

        let yOffset = -distanceFromCenter * speed * mobileFactor
        // Clamp to prevent horizontal/vertical overflow or excessive drift
        yOffset = Math.max(-maxOffset, Math.min(maxOffset, yOffset))

        el.style.setProperty('--parallax-y', `${yOffset.toFixed(2)}px`)

        if (rawScale) {
          const scaleRate = parseFloat(rawScale)
          // Scale peaks smoothly when element is near viewport center
          const progress0to1 = Math.max(0, 1 - Math.abs(distanceFromCenter) / viewportCenter)
          const scaleVal = 1 + (progress0to1 * scaleRate)
          el.style.setProperty('--parallax-scale', `${scaleVal.toFixed(3)}`)
        }
      })

      isTicking = false
    }

    const onScroll = () => {
      if (!isTicking) {
        isTicking = true
        rafId = window.requestAnimationFrame(updateParallax)
      }
    }

    // Run initial positioning
    updateParallax()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [dependencyKey])
}

export default useParallax
