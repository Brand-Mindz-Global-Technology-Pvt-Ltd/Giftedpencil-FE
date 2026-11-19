import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/home/Hero'
import AboutStory from '../components/home/AboutStory'
import Products from '../components/home/Products'
import Categories from '../components/home/Categories'
import WhyChoose from '../components/home/WhyChoose'
import CTA from '../components/home/CTA'

// Toggle to easily restore the Categories section when needed
const SHOW_CATEGORIES = false

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    const stateTarget = (location.state as { scrollTo?: string } | null)?.scrollTo
    const hashTarget = location.hash ? location.hash.replace('#', '') : null
    const targetId = stateTarget || hashTarget

    if (targetId) {
      const scrollToTarget = () => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Initial execution and fallback to account for layout shifts
      const timer1 = setTimeout(scrollToTarget, 60)
      const timer2 = setTimeout(scrollToTarget, 220)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [location.pathname, location.hash, location.state])

  return (
    <div className="home-page">
      <Hero />
      <AboutStory />
      <Products />
      {SHOW_CATEGORIES && <Categories />}
      <WhyChoose />
      <CTA />
    </div>
  )
}

export default Home
