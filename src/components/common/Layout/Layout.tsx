import type { ReactNode } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="site-layout">
      <Header />
      <main className="site-content">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
