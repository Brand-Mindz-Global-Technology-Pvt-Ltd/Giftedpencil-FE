import React from 'react'
import heroBannerImg from '../../assets/Home/Hero-banner.png'

const AboutHero: React.FC = () => {
  const scrollToStory = () => {
    const storyEl = document.getElementById('our-story')
    if (storyEl) {
      storyEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="about-hero-banner"
      aria-label="About The Gifted Pencil Banner"
    >
      <div
        className="parallax-bg-layer"
        style={{ backgroundImage: `url(${heroBannerImg})` }}
        data-parallax-speed="-0.22"
        aria-hidden="true"
      />
      <div className="about-hero-inner">
        <div className="about-hero-content">
          <div className="about-hero-badge" data-parallax-speed="-0.06">
            <span className="about-hero-badge-line" aria-hidden="true" />
            <span className="about-hero-badge-text">ABOUT THE GIFTED PENCIL</span>
            <span className="about-hero-badge-line" aria-hidden="true" />
          </div>

          <h1 className="about-hero-heading">
            <span className="about-hero-heading-line1">The Story Behind</span>
            <span className="about-hero-heading-line2">
              The <span className="about-hero-heading-script">Gifted Pencil</span>
              <span className="about-hero-heart-flourish-wrap" data-parallax-speed="-0.10" aria-hidden="true">
                <svg
                  viewBox="0 0 96 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="about-hero-heart-flourish"
                >
                  <path
                    d="M4 32 C 16 32, 28 32, 40 26 C 46 22, 54 12, 62 12 C 70 12, 76 20, 68 28 C 62 34, 52 32, 48 24 C 44 16, 52 6, 60 6 C 68 6, 76 14, 76 22 C 76 30, 84 34, 92 34"
                    stroke="#252020"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p className="about-hero-description">
            A brand born from a love for journaling, self-discovery, and meaningful growth.
          </p>

          <div className="about-hero-cta-wrap">
            <button
              type="button"
              className="about-hero-cta-btn"
              onClick={scrollToStory}
              aria-label="Scroll to Our Story"
            >
              <span>Our Story</span>
              <span className="about-btn-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
