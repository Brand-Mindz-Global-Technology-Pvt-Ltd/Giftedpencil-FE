import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import logoImg from '../../../assets/Logo.jpg'

type NavSection = 'home' | 'about' | 'contact' | null

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // State for user-clicked selection and scroll-spy detected section
  const [clickedSection, setClickedSection] = useState<NavSection | null>(null)
  const [scrolledSection, setScrolledSection] = useState<NavSection | null>(null)

  // Derived active section based on route, hash, click, or scroll
  const activeSection: NavSection = !isHome
    ? null
    : clickedSection ||
      (location.hash === '#our-story'
        ? 'about'
        : location.hash === '#footer'
          ? 'contact'
          : scrolledSection || 'home')

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })

  const navListRef = useRef<HTMLUListElement | null>(null)
  const homeRef = useRef<HTMLAnchorElement | null>(null)
  const aboutRef = useRef<HTMLAnchorElement | null>(null)
  const contactRef = useRef<HTMLAnchorElement | null>(null)
  const isClickScrollRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Update sliding green underline position and width using requestAnimationFrame
  useEffect(() => {
    const measureIndicator = () => {
      if (!isHome || !activeSection || !navListRef.current) {
        setIndicatorStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }))
        return
      }

      let targetEl: HTMLAnchorElement | null = null
      if (activeSection === 'home') targetEl = homeRef.current
      else if (activeSection === 'about') targetEl = aboutRef.current
      else if (activeSection === 'contact') targetEl = contactRef.current

      if (targetEl && navListRef.current) {
        const navRect = navListRef.current.getBoundingClientRect()
        const targetRect = targetEl.getBoundingClientRect()
        const nextLeft = targetRect.left - navRect.left
        const nextWidth = targetRect.width

        setIndicatorStyle((prev) => {
          if (prev.left === nextLeft && prev.width === nextWidth && prev.opacity === 1) {
            return prev
          }
          return {
            left: nextLeft,
            width: nextWidth,
            opacity: 1,
          }
        })
      }
    }

    const rafId = requestAnimationFrame(measureIndicator)
    window.addEventListener('resize', measureIndicator)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measureIndicator)
    }
  }, [activeSection, isHome])

  // Scroll spy to update active indicator as user scrolls
  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      if (isClickScrollRef.current) return

      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight

      // If near bottom of the page, highlight Contact Us (Footer)
      if (scrollY + winHeight >= docHeight - 140) {
        setScrolledSection('contact')
        return
      }

      const footerEl = document.getElementById('footer')
      if (footerEl) {
        const fRect = footerEl.getBoundingClientRect()
        if (fRect.top <= winHeight * 0.45) {
          setScrolledSection('contact')
          return
        }
      }

      const storyEl = document.getElementById('our-story')
      if (storyEl) {
        const sRect = storyEl.getBoundingClientRect()
        if (sRect.top <= 240 && sRect.bottom >= 120) {
          setScrolledSection('about')
          return
        }
      }

      // If near top of the page
      if (scrollY < 300) {
        setScrolledSection('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const triggerClickScroll = (section: NavSection) => {
    closeMobileMenu()
    setClickedSection(section)

    isClickScrollRef.current = true
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = window.setTimeout(() => {
      isClickScrollRef.current = false
      setClickedSection(null)
    }, 900)
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    triggerClickScroll('home')

    if (isHome) {
      const heroEl = document.getElementById('hero') || document.querySelector('.hero-banner')
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      navigate('/#hero', { state: { scrollTo: 'hero' } })
    }
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    triggerClickScroll('about')

    if (isHome) {
      const storyEl = document.getElementById('our-story')
      if (storyEl) {
        storyEl.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/#our-story', { state: { scrollTo: 'our-story' } })
    }
  }

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    triggerClickScroll('contact')

    if (isHome) {
      const footerEl = document.getElementById('footer')
      if (footerEl) {
        footerEl.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/#footer', { state: { scrollTo: 'footer' } })
    }
  }

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Left Side: Logo & Main Navigation */}
        <div className="header-left">
          <Link
            to="/"
            className="header-logo-link"
            onClick={handleHomeClick}
            aria-label="The Gifted Pencil Home"
          >
            <img src={logoImg} alt="The Gifted Pencil" className="header-logo" />
          </Link>

          <span className="header-divider hide-mobile" aria-hidden="true" />

          {/* Desktop Navigation */}
          <nav className="header-nav hide-mobile" aria-label="Primary navigation">
            <ul ref={navListRef} className="nav-list">
              <li className="nav-item">
                <a
                  ref={homeRef}
                  href="/#hero"
                  className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                  onClick={handleHomeClick}
                >
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a
                  ref={aboutRef}
                  href="/#our-story"
                  className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={handleAboutClick}
                >
                  About Us
                </a>
              </li>

              <li className="nav-item">
                <a
                  ref={contactRef}
                  href="/#footer"
                  className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={handleContactClick}
                >
                  Contact Us
                </a>
              </li>

              {/* Smoothly moving green active underline indicator */}
              <span
                className="nav-sliding-indicator"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
                aria-hidden="true"
              />
            </ul>
          </nav>
        </div>

        {/* Right Side: Action Icons (Search) */}
        <div className="header-right">
          <div className="search-container">
            {isSearchOpen ? (
              <form
                className="header-search-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsSearchOpen(false)
                }}
              >
                <input
                  type="text"
                  placeholder="Search journals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="header-search-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="header-search-close"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-logo-wrap">
                <img src={logoImg} alt="The Gifted Pencil" className="mobile-logo" />
              </div>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-nav" aria-label="Mobile navigation">
              <ul className="mobile-nav-list">
                <li>
                  <a
                    href="/#hero"
                    className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
                    onClick={handleHomeClick}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/#our-story"
                    className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`}
                    onClick={handleAboutClick}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#footer"
                    className={`mobile-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                    onClick={handleContactClick}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
