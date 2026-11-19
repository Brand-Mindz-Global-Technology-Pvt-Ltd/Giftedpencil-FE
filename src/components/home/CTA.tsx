import ctaImage from '../../assets/Home/cta.png'

const CTA = () => {
  const handleShopNow = () => {
    const productsSection = document.querySelector('.products-section')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="cta-section" aria-label="Call to Action">
      <div className="cta-container">
        {/* Centered Content Block */}
        <div className="cta-content">
          <h2 className="cta-heading">Make Every Page Meaningful</h2>
          <p className="cta-desc">
            Start your journaling journey with The Gifted Pencil today!
          </p>
          <button
            type="button"
            className="cta-button"
            onClick={handleShopNow}
            aria-label="Shop journals now"
          >
            Shop Now &rarr;
          </button>
        </div>

        {/* Right Side Journal Image */}
        <div className="cta-image-wrapper">
          <img
            src={ctaImage}
            alt="The Gifted Pencil journal with heart"
            className="cta-image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default CTA
