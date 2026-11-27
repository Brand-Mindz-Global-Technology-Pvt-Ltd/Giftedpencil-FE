import {
  Lightbulb,
  Heart,
  Target,
  Palette,
  Camera,
  Sprout,
  ArrowRight,
} from 'lucide-react'
import whyImage from '../../assets/Home/why.png'

interface BenefitItem {
  id: string
  title: string
  icon: typeof Lightbulb
}

const column1Benefits: BenefitItem[] = [
  {
    id: 'self-discovery',
    title: 'Self-Discovery',
    icon: Lightbulb,
  },
  {
    id: 'creative-expression',
    title: 'Creative Expression',
    icon: Palette,
  },
]

const column2Benefits: BenefitItem[] = [
  {
    id: 'self-expression',
    title: 'Self-Expression',
    icon: Heart,
  },
  {
    id: 'memory-keeping',
    title: 'Memory Keeping',
    icon: Camera,
  },
]

const column3Benefits: BenefitItem[] = [
  {
    id: 'goal-setting',
    title: 'Goal Setting & Planning',
    icon: Target,
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth',
    icon: Sprout,
  },
]

const WhyChoose = () => {
  const handleDiscoverMore = () => {
    const aboutSection = document.querySelector('.about-story-section')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="why-section" aria-label="Why Choose The Gifted Pencil">
      <div className="why-container">
        {/* Left Side: Olive Card & Benefits Columns */}
        <div className="why-left-content">
          {/* Olive Green Feature Card */}
          <div className="why-card-olive reveal-slide-left" data-parallax-speed="-0.06">
            <h2 className="why-card-title">
              Why Choose
              <br />
              The Gifted Pencil?
            </h2>
            <p className="why-card-desc">
              Because journaling is more than writing &ndash; it&apos;s a journey towards a better you.
            </p>
            <button
              type="button"
              className="why-card-btn"
              onClick={handleDiscoverMore}
              aria-label="Discover more about The Gifted Pencil"
            >
              <span>Discover More</span>
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>

          {/* 6 Benefits in 3 Columns with Vertical Dividers */}
          <div className="why-benefits-wrap">
            {/* Column 1 */}
            <div className="why-benefit-col">
              {column1Benefits.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.id} className="why-benefit-item">
                    <div className="why-icon-badge" aria-hidden="true">
                      <IconComponent size={20} strokeWidth={1.8} />
                    </div>
                    <span className="why-benefit-title">{item.title}</span>
                  </div>
                )
              })}
            </div>

            <span className="why-col-divider" aria-hidden="true" />

            {/* Column 2 */}
            <div className="why-benefit-col">
              {column2Benefits.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.id} className="why-benefit-item">
                    <div className="why-icon-badge" aria-hidden="true">
                      <IconComponent size={20} strokeWidth={1.8} />
                    </div>
                    <span className="why-benefit-title">{item.title}</span>
                  </div>
                )
              })}
            </div>

            <span className="why-col-divider" aria-hidden="true" />

            {/* Column 3 */}
            <div className="why-benefit-col">
              {column3Benefits.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.id} className="why-benefit-item">
                    <div className="why-icon-badge" aria-hidden="true">
                      <IconComponent size={20} strokeWidth={1.8} />
                    </div>
                    <span className="why-benefit-title">{item.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Prominent Rounded Image */}
        <div className="why-right-image-wrap">
          <div className="why-image-container reveal-scale">
            <img
              src={whyImage}
              alt="Write. Dream. Grow. journal with pen"
              className="why-image"
              data-parallax-speed="0.12"
              data-parallax-scale="0.03"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
