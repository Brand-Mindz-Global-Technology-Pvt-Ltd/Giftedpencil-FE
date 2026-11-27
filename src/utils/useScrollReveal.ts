import { useEffect } from 'react'

const SELECTORS = [
  '.reveal-on-scroll:not(.is-revealed)',
  '.reveal-scale:not(.is-revealed)',
  '.reveal-slide-left:not(.is-revealed)',
  '.reveal-slide-right:not(.is-revealed)',
  '.reveal-galaxy-card:not(.is-revealed)',
  '.reveal-text-rise:not(.is-revealed)'
].join(', ')

const ALL_TARGETS = [
  '.reveal-on-scroll',
  '.reveal-scale',
  '.reveal-slide-left',
  '.reveal-slide-right',
  '.reveal-galaxy-card',
  '.reveal-text-rise'
].join(', ')

/**
 * Modern Interactive Motion - Immersive Galaxy Scroll Reveal Engine
 *
 * Progressively reveals elements as the user scrolls into view.
 * Features:
 * - Elements below the initial viewport remain hidden until scrolled into view.
 * - Reverse scroll re-entry: when an element drops below the bottom viewport,
 *   its reveal state resets so it re-animates on the next downward scroll.
 * - Passive rAF scroll listener ensures rapid scrolling never leaves elements invisible.
 * - Immediate fallback for prefers-reduced-motion and environments without IntersectionObserver.
 */
export function useScrollReveal(dependencyKey?: unknown) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealAll = () => {
      document.querySelectorAll(ALL_TARGETS).forEach((el) => {
        el.classList.add('is-revealed')
      })
    }

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    // Configured with a negative bottom margin so elements visibly cross into view before triggering
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          } else {
            // Reverse scroll re-entry: if element moved back BELOW the viewport bottom, reset reveal
            if (entry.boundingClientRect.top > window.innerHeight) {
              entry.target.classList.remove('is-revealed')
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: [0, 0.15]
      }
    )

    const observeElements = () => {
      const allElements = document.querySelectorAll(ALL_TARGETS)
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // Only elements well within the initial upper viewport are immediately visible
        const inInitialScreen = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
        if (inInitialScreen) {
          el.classList.add('is-revealed')
        } else {
          // Keep hidden until user scrolls to it
          observer.observe(el)
        }
      })
    }

    // Initial check
    observeElements()

    // Fast-scroll safety: throttled check using requestAnimationFrame
    let ticking = false
    const handleFastScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const elements = document.querySelectorAll(SELECTORS)
          elements.forEach((el) => {
            const rect = el.getBoundingClientRect()
            if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
              el.classList.add('is-revealed')
            }
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleFastScroll, { passive: true })

    // Observe dynamic elements (e.g. backend products, async cart items)
    let mutationObserver: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeElements()
      })

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      })
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleFastScroll)
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    }
  }, [dependencyKey])
}

export default useScrollReveal
