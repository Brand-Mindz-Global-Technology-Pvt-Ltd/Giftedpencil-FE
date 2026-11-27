import React from 'react'
import ctaImage from '../../assets/Home/cta.png'

interface CTAProps {
  heading?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  imageSrc?: string
  imageAlt?: string
  className?: string
}

const CTA: React.FC<CTAProps> = ({
  heading = 'Make Every Page Meaningful',
  description = 'Start your journaling journey with The Gifted Pencil today!',
  buttonText = 'Shop Now →',
  onButtonClick,
  imageSrc = ctaImage,
  imageAlt = 'The Gifted Pencil journal with heart',
  className = '',
}) => {
  const handleAction = () => {
    if (onButtonClick) {
      onButtonClick()
      return
    }
    const productsSection = document.querySelector('.products-section')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className={`cta-section ${className}`.trim()} aria-label="Call to Action">
      <div className="cta-container reveal-scale">
        {/* Centered Content Block */}
        <div className="cta-content reveal-on-scroll" data-parallax-speed="0.04">
          <h2 className="cta-heading">{heading}</h2>
          <p className="cta-desc">{description}</p>
          <button
            type="button"
            className="cta-button"
            onClick={handleAction}
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>

        {/* Right Side Journal Image */}
        <div className="cta-image-wrapper reveal-scale" data-parallax-speed="-0.12">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="cta-image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default CTA
