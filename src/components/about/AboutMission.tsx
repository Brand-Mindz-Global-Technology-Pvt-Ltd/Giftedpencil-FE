import React from 'react'
import { Sprout, Heart, Sparkles } from 'lucide-react'
import missionImg from '../../assets/about us/our-mission.png'

const AboutMission: React.FC = () => {
  return (
    <section className="about-mission-section" aria-label="Our Mission">
      <div className="about-mission-container">
        {/* Left: Capsule Framed Image */}
        <div className="about-mission-image-col reveal-scale">
          <div className="about-capsule-frame about-mission-frame">
            <img
              src={missionImg}
              alt="Stacked Gifted Pencil journals"
              className="about-capsule-img"
              data-parallax-speed="0.10"
              data-parallax-scale="0.03"
              loading="lazy"
            />
          </div>
        </div>

        {/* Center: Mission Title & Narrative */}
        <div className="about-mission-content-col reveal-slide-right">
          <div className="about-pill-badge-wrap">
            <span className="about-pill-badge-line" aria-hidden="true" />
            <span className="about-pill-badge">Our Mission</span>
            <span className="about-pill-badge-line" aria-hidden="true" />
          </div>

          <h2 className="about-mission-heading">
            A More Mindful,<br />Meaningful You
          </h2>

          <p className="about-mission-desc">
            To create thoughtfully designed journals that inspire self-reflection, creativity,
            gratitude, and personal growth—one page at a time.
          </p>
        </div>

        {/* Right: Pillars with Divider */}
        <div className="about-mission-pillars-col" data-parallax-speed="-0.07">
          <div className="about-mission-divider hide-mobile" aria-hidden="true" />
          <div className="about-mission-pillars-list">
            {/* Pillar 1 */}
            <div className="about-pillar-item">
              <div className="about-pillar-icon-wrap" aria-hidden="true">
                <Sprout size={20} strokeWidth={1.8} />
              </div>
              <div className="about-pillar-text">
                <h3 className="about-pillar-title">Reflect</h3>
                <p className="about-pillar-desc">Gain clarity and perspective</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="about-pillar-item">
              <div className="about-pillar-icon-wrap" aria-hidden="true">
                <Heart size={20} strokeWidth={1.8} />
              </div>
              <div className="about-pillar-text">
                <h3 className="about-pillar-title">Grow</h3>
                <p className="about-pillar-desc">Build positive habits</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="about-pillar-item">
              <div className="about-pillar-icon-wrap" aria-hidden="true">
                <Sparkles size={20} strokeWidth={1.8} />
              </div>
              <div className="about-pillar-text">
                <h3 className="about-pillar-title">Thrive</h3>
                <p className="about-pillar-desc">Create a life you love</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMission
