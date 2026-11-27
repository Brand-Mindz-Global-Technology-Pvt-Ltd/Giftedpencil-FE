import React from 'react'
import { Check } from 'lucide-react'
import bookImg from '../../assets/about us/book.png'

interface DifferentiatorItem {
  title: string
  description: string
}

const differentiators: DifferentiatorItem[] = [
  {
    title: 'Purposeful Designs',
    description: 'Journals created with intention—for reflection, gratitude, goals, and more.',
  },
  {
    title: 'Premium Quality',
    description: 'Durable, beautiful, and made to be part of your everyday life.',
  },
  {
    title: 'Thoughtful Variety',
    description: 'A curated collection for different life stages, needs, and dreams.',
  },
  {
    title: 'A Supportive Community',
    description: 'A growing family of journalers who believe in growth, creativity, and living meaningfully.',
  },
]

const AboutWhyDifferent: React.FC = () => {
  return (
    <section
      className="about-different-section"
      aria-label="What Makes The Gifted Pencil Different"
    >
      <div className="about-section-container">
        {/* Centered Section Header */}
        <div className="about-section-header reveal-on-scroll">
          <span className="about-section-header-line" aria-hidden="true" />
          <h2 className="about-section-title">What Makes The Gifted Pencil Different</h2>
          <span className="about-section-header-line" aria-hidden="true" />
        </div>

        {/* 2-Column Layout */}
        <div className="about-different-grid">
          {/* Left: Capsule Framed Image */}
          <div className="about-different-image-col reveal-scale">
            <div className="about-capsule-frame about-different-frame">
              <img
                src={bookImg}
                alt="The Gifted Pencil notebook on cozy blanket"
                className="about-capsule-img"
                data-parallax-speed="0.10"
                data-parallax-scale="0.03"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: 4 Checklist Items */}
          <div className="about-different-list-col reveal-slide-right">
            {differentiators.map((item, index) => (
              <div key={index} className={`about-diff-item reveal-on-scroll stagger-${(index % 4) + 1}`}>
                <div className="about-diff-check-wrap" aria-hidden="true">
                  <Check size={18} strokeWidth={2.4} />
                </div>
                <div className="about-diff-text">
                  <h3 className="about-diff-title">{item.title}</h3>
                  <p className="about-diff-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutWhyDifferent
