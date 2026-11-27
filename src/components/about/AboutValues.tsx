import React from 'react'
import { Heart, Sprout, Gem, Users, Leaf } from 'lucide-react'

interface ValueItem {
  icon: React.ReactNode
  title: string
  description: string
}

const valuesData: ValueItem[] = [
  {
    icon: <Heart size={22} strokeWidth={1.8} />,
    title: 'Mindfulness',
    description: 'Encouraging presence, clarity, and self-awareness.',
  },
  {
    icon: <Sprout size={22} strokeWidth={1.8} />,
    title: 'Growth',
    description: 'Supporting your personal and emotional journey.',
  },
  {
    icon: <Gem size={22} strokeWidth={1.8} />,
    title: 'Quality',
    description: 'Thoughtful design, premium materials, and lasting value.',
  },
  {
    icon: <Users size={22} strokeWidth={1.8} />,
    title: 'Authenticity',
    description: 'Real, relatable, and uplifting for every stage of life.',
  },
  {
    icon: <Leaf size={22} strokeWidth={1.8} />,
    title: 'Positivity',
    description: 'Inspiring a more intentional, joyful, and balanced life.',
  },
]

const AboutValues: React.FC = () => {
  return (
    <section className="about-values-section" aria-label="Our Values">
      <div className="about-section-container">
        {/* Centered Section Header */}
        <div className="about-section-header reveal-on-scroll">
          <span className="about-section-header-line" aria-hidden="true" />
          <h2 className="about-section-title">Our Values</h2>
          <span className="about-section-header-line" aria-hidden="true" />
        </div>

        {/* 5-Card Grid */}
        <div className="about-values-grid">
          {valuesData.map((item, index) => (
            <div key={index} className={`about-value-card reveal-on-scroll stagger-${(index % 5) + 1}`}>
              <div className="about-value-icon-wrap" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="about-value-title">{item.title}</h3>
              <p className="about-value-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutValues
