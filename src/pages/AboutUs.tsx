import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AboutHero from '../components/about/AboutHero'
import AboutMission from '../components/about/AboutMission'
import AboutStorySection from '../components/about/AboutStorySection'
import AboutValues from '../components/about/AboutValues'
import AboutWhyDifferent from '../components/about/AboutWhyDifferent'
import CTA from '../components/home/CTA'
import ctaImg from '../assets/about us/cta.png'

const AboutUs: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // If navigating to /about with hash #our-story, smooth scroll to it
    if (window.location.hash === '#our-story') {
      const el = document.getElementById('our-story')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="about-page">
      {/* 1. Top Hero Banner */}
      <AboutHero />

      {/* 2. Our Mission Section */}
      <AboutMission />

      {/* 3. Our Brand Story Section */}
      <AboutStorySection />

      {/* 4. Our Values Section */}
      <AboutValues />

      {/* 5. What Makes The Gifted Pencil Different Section */}
      <AboutWhyDifferent />

      {/* 6. CTA Banner */}
      <CTA
        heading="Start Your Journaling Journey"
        description="Discover journals designed to help you reflect, grow, and create the life you envision."
        buttonText="Shop Our Journals →"
        imageSrc={ctaImg}
        imageAlt="Open journal with Write Reflect Grow and flowers"
        onButtonClick={() => navigate('/shop')}
      />
    </div>
  )
}

export default AboutUs
