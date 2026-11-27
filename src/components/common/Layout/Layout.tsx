import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import useScrollReveal from '../../../utils/useScrollReveal'
import useParallax from '../../../utils/useParallax'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  // Scroll to top and re-initialize scroll reveals on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useScrollReveal(location.pathname)
  useParallax(location.pathname)

  return (
    <div className="site-layout">
      <Header />
      <main key={location.pathname} className="site-content page-entrance-active">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
