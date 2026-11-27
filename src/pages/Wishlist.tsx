import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WishlistBanner from '../components/wishlist/WishlistBanner'
import WishlistContent from '../components/wishlist/WishlistContent'
import CTA from '../components/home/CTA'

const Wishlist: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="wishlist-page">
      {/* 1. Top Banner (Reusing Cart Banner image & structure) */}
      <WishlistBanner />

      {/* 2. Main Wishlist Container */}
      <main className="wishlist-main-section">
        <div className="wishlist-main-container">
          <WishlistContent />
        </div>
      </main>

      {/* 3. Reused CTA Component */}
      <CTA
        heading="Find Your Next Journaling Companion"
        description="Explore our thoughtfully designed journals, planners and stationery essentials."
        buttonText="Shop the Collection →"
        onButtonClick={() => navigate('/shop')}
        className="wishlist-cta"
      />
    </div>
  )
}

export default Wishlist
