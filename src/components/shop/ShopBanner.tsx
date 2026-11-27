import shopBannerImg from '../../assets/top banner/shop-banner.png'

const ShopBanner = () => {
  return (
    <section
      className="shop-banner"
      aria-label="Shop Collection Banner"
    >
      <div
        className="parallax-bg-layer"
        style={{ backgroundImage: `url(${shopBannerImg})`, backgroundPosition: 'center center' }}
        data-parallax-speed="-0.20"
        aria-hidden="true"
      />
      <div className="shop-banner-inner">
        <div className="shop-banner-content reveal-on-scroll">
          <div className="shop-badge" data-parallax-speed="-0.06">
            <span className="shop-badge-line" aria-hidden="true" />
            <span className="shop-badge-text">OUR COLLECTION</span>
            <span className="shop-badge-line" aria-hidden="true" />
          </div>

          <h1 className="shop-heading">
            Shop Journals for a{' '}
            <span className="shop-heading-script">More Mindful You</span>
          </h1>

          <p className="shop-subtitle">
            Thoughtfully designed journals, planners and wellness essentials for your everyday journey.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ShopBanner
