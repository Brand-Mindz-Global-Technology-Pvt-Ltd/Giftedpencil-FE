import { Gem, Heart, Star } from 'lucide-react'
import girlJournalImg from '../../assets/Home/girl-image.png'

const AboutStory = () => {
  return (
    <section
      id="our-story"
      className="about-story-section"
      aria-label="About The Gifted Pencil"
    >
      <div className="about-story-container">
        {/* Left: Girl Journaling Image in Rounded Arch/Capsule */}
        <div className="about-story-image-wrap reveal-scale">
          <img
            src={girlJournalImg}
            alt="Young woman writing in journal"
            className="about-story-image"
            data-parallax-speed="0.10"
            data-parallax-scale="0.03"
          />
        </div>

        {/* Center: Story & Mission Content */}
        <div className="about-story-content reveal-on-scroll">
          <div className="about-badge">
            <span className="about-badge-line" aria-hidden="true" />
            <span className="about-badge-text">About The Gifted Pencil</span>
            <span className="about-badge-line" aria-hidden="true" />
          </div>

          <h2 className="about-story-title">Our Story</h2>

          <p className="about-story-desc">
            At The Gifted Pencil, we believe that everyone has a story worth telling.
          </p>

          <a href="#" className="about-story-btn" onClick={(e) => e.preventDefault()}>
            Know More &rarr;
          </a>
        </div>

        {/* Right: Three Key Highlight Items */}
        <div className="about-story-highlights-wrap reveal-slide-right" data-parallax-speed="-0.06">
          <div className="about-story-divider hide-mobile" aria-hidden="true" />
          <div className="about-story-highlights">
            {/* Highlight 1: Creative Journals */}
            <div className="about-highlight-item">
              <div className="about-highlight-icon">
                <Gem size={22} strokeWidth={1.8} />
              </div>
              <div className="about-highlight-text">
                <span className="about-highlight-value">100%</span>
                <span className="about-highlight-label">Creative Journals</span>
              </div>
            </div>

            {/* Highlight 2: Happy Readers */}
            <div className="about-highlight-item">
              <div className="about-highlight-icon">
                <Heart size={22} strokeWidth={1.8} />
              </div>
              <div className="about-highlight-text">
                <span className="about-highlight-value">5k+</span>
                <span className="about-highlight-label">Happy Readers</span>
              </div>
            </div>

            {/* Highlight 3: Growing Together */}
            <div className="about-highlight-item">
              <div className="about-highlight-icon">
                <Star size={22} strokeWidth={1.8} />
              </div>
              <div className="about-highlight-text">
                <span className="about-highlight-value">Since 2024</span>
                <span className="about-highlight-label">Growing Together</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutStory
