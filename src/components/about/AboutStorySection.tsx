import React from 'react'
import storyImg from '../../assets/about us/brand_story.png'

const AboutStorySection: React.FC = () => {
  return (
    <section id="our-story" className="about-story-row-section" aria-label="Our Brand Story">
      <div className="about-section-container">
        {/* Centered Section Header */}
        <div className="about-section-header reveal-on-scroll">
          <span className="about-section-header-line" aria-hidden="true" />
          <h2 className="about-section-title">Our Brand Story</h2>
          <span className="about-section-header-line" aria-hidden="true" />
        </div>

        {/* 2-Column Layout */}
        <div className="about-story-row-grid">
          {/* Left: Capsule Framed Image */}
          <div className="about-story-row-image-col reveal-scale">
            <div className="about-capsule-frame about-story-frame">
              <img
                src={storyImg}
                alt="Open journal with handwritten Our Story"
                className="about-capsule-img"
                data-parallax-speed="0.10"
                data-parallax-scale="0.03"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Narrative Text */}
          <div className="about-story-row-text-col reveal-slide-right">
            <p className="about-narrative-paragraph">
              The Gifted Pencil began with a simple belief: that journaling has the power to transform
              everyday thoughts into a more intentional, joyful life.
            </p>
            <p className="about-narrative-paragraph">
              What started as a personal passion for writing, reflecting, and setting goals evolved
              into a brand dedicated to helping others do the same. Today, we create beautiful,
              high-quality journals that become trusted companions on life's many journeys—through
              dreams, challenges, milestones, and everything in between.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutStorySection
