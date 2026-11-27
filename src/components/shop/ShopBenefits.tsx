import { Truck, ShieldCheck, Headphones } from 'lucide-react'

interface BenefitItem {
  icon: typeof Truck
  title: string
  subtitle: string
}

const BENEFITS: BenefitItem[] = [
  {
    icon: Truck,
    title: 'Fast & Secure Delivery',
    subtitle: 'Across India',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Trusted Checkout',
    subtitle: 'Multiple payment options',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    subtitle: "We're here to help",
  },
]

const ShopBenefits = () => {
  return (
    <section className="shop-benefits-section" aria-label="Customer Guarantees and Benefits">
      <div className="shop-benefits-container reveal-scale">
        <div className="shop-benefits-card">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon
            const speeds = ['-0.05', '-0.09', '-0.05']
            return (
              <div
                key={index}
                className={`shop-benefit-col reveal-on-scroll stagger-${index + 1}`}
                data-parallax-speed={speeds[index]}
              >
                <div className="shop-benefit-icon-wrapper" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.8} className="shop-benefit-icon" />
                </div>
                <div className="shop-benefit-text-wrapper">
                  <h3 className="shop-benefit-title">{item.title}</h3>
                  <p className="shop-benefit-subtitle">{item.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopBenefits
