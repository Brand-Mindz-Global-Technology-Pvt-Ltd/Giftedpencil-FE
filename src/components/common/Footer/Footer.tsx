import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import logoImg from '../../../assets/Logo.jpg'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer id="footer" className="site-footer">
      <div className="footer-top-container">
        {/* Column 1: Brand & Tagline */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo-link" aria-label="The Gifted Pencil Home">
            <img src={logoImg} alt="The Gifted Pencil" className="footer-logo" />
          </Link>
          <p className="footer-tagline">Write &bull; Dream &bull; Grow</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-nav-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="footer-link">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className="footer-nav-col">
          <h4 className="footer-heading">Policies</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/privacy-policy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="footer-link">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="footer-link">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/return-refund-policy" className="footer-link">
                Return &amp; Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Stay Connected with Divider */}
        <div className="footer-connected-col">
          <div className="footer-col-divider hide-mobile" aria-hidden="true" />
          <div className="footer-connected-content">
            <h4 className="footer-heading">Stay Connected</h4>
            <div className="footer-social-icons">
              {/* Instagram */}
              <a
                href="#"
                className="social-icon-btn"
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                className="social-icon-btn"
                aria-label="Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="social-icon-btn"
                aria-label="YouTube"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02l-.01-6.54 5.72 3.27-5.71 3.27z"></path>
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                className="social-icon-btn"
                aria-label="Pinterest"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <p className="footer-subscribe-prompt">Subscribe for journaling inspiration!</p>

            <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-email-input"
                required
              />
              <button type="submit" className="footer-subscribe-btn">
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="subscription-feedback">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom-bar">
        <p className="copyright-text">
          &copy; 2026 The Gifted Pencil. All Rights Reserved.{' '}
          <Heart size={14} className="copyright-heart" />
        </p>
      </div>
    </footer>
  )
}

export default Footer
