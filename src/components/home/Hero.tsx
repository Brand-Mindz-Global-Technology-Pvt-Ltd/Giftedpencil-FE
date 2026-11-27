import { Link } from 'react-router-dom'
import heroBannerImg from '../../assets/Home/Hero-banner.png'

const Hero = () => {
  return (
    <section
      id="hero"
      className="hero-banner"
      aria-label="The Gifted Pencil Hero Banner"
    >
      <div
        className="parallax-bg-layer"
        style={{ backgroundImage: `url(${heroBannerImg})` }}
        data-parallax-speed="-0.22"
        aria-hidden="true"
      />
      <div className="hero-banner-inner">
        <div className="hero-banner-content">
          <div className="hero-badge" data-parallax-speed="-0.06">
            <span className="hero-badge-line" aria-hidden="true" />
            <span className="hero-badge-text">JOURNAL · REFLECT · GROW</span>
            <span className="hero-badge-line" aria-hidden="true" />
          </div>

          <h1 className="hero-heading">
            Every Journey Begins With a{' '}
            <span className="hero-heading-script">
              Thought.
              <span className="hero-heart" data-parallax-speed="-0.10" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="hero-heart-svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="hero-description">
            A journal for your thoughts, dreams and beautiful memories.
          </p>

          <div className="hero-cta-wrapper">
            <Link to="/shop" className="hero-cta-btn">
              Explore Journals &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
