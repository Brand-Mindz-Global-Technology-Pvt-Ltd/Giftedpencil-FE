import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Layout from '../components/common/Layout/Layout'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <div className="policy-page">
        {/* Breadcrumb Navigation */}
        <div className="policy-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="policy-breadcrumb-link">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="policy-breadcrumb-current">Privacy Policy</span>
        </div>

        <article className="policy-container">
          <header className="policy-header">
            <span className="policy-brand-tag">The Gifted Pencil</span>
            <h1 className="policy-title">PRIVACY POLICY</h1>
            <p className="policy-tagline-quote">Every thought has a place. Every journey deserves a page.</p>
            <div className="policy-divider" aria-hidden="true" />
          </header>

          <div className="policy-body">
            <p className="policy-intro">
              At The Gifted Pencil, we believe journaling is a personal journey of expression, reflection, creativity and growth. Whether it is a child&apos;s first journal, an adult&apos;s self-discovery journey, a pregnancy journal or a personal wellness journal, we respect the privacy and individuality of every person who uses our products.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, protect and manage personal information associated with our products, services and official online platforms.
            </p>

            <section className="policy-section">
              <h2 className="policy-section-title">1. Scope of This Policy</h2>
              <p>
                This policy applies to all customers, visitors and users of The Gifted Pencil, irrespective of age or the type of journal purchased or used.
              </p>
              <p>
                Our journals may be designed for children, teenagers, adults, expecting parents, mothers and individuals pursuing personal growth and well-being.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Privacy of Journal Entries</h2>
              <p>
                We recognise that journals may contain deeply personal thoughts, emotions, experiences, goals, memories, health-related reflections and other private information.
              </p>
              <p>All entries written in a physical journal belong to the individual using it.</p>
              <p>
                We do not collect, access, read, publish or share personal journal entries as part of the normal use of our physical products.
              </p>
              <p>Users are encouraged to maintain the confidentiality of their journals.</p>
              <p>We respect every individual&apos;s right to personal expression and privacy.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. Personal Information We Collect</h2>
              <p>When customers purchase our products or interact with our business, we may collect the following information:</p>
              <ul className="policy-bullet-list">
                <li>Name and contact details.</li>
                <li>Email address and telephone number.</li>
                <li>Billing and shipping address.</li>
                <li>Order and transaction details.</li>
                <li>Customer enquiries and feedback.</li>
                <li>Information voluntarily provided through our website, forms or other communication channels.</li>
              </ul>
              <p>We collect only the information reasonably necessary for our business operations.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. Children&apos;s Privacy</h2>
              <p>We recognise that some of our journals are specifically designed for children.</p>
              <p>
                We are committed to protecting children&apos;s personal information and complying with applicable child data protection laws.
              </p>
              <p>
                We do not intentionally collect children&apos;s personal information without the required parental or guardian consent.
              </p>
              <p>
                Parents or legal guardians should supervise children&apos;s online purchases and interactions with our platforms.
              </p>
              <p>
                Children should avoid recording sensitive information such as passwords, home addresses and financial details in their journals.
              </p>
              <p>Parents or guardians may contact us regarding their child&apos;s personal information.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Pregnancy and Personal Wellness Journals</h2>
              <p>
                Some of our journals may be used to document pregnancy experiences, motherhood journeys, health-related reflections, emotions and personal milestones.
              </p>
              <p>We understand that such information can be particularly private.</p>
              <p>
                The Gifted Pencil does not collect or access these personal journal entries through the use of our physical products. Customers should exercise discretion when sharing personal or sensitive information through online forms or communication channels.
              </p>
              <p>
                Our pregnancy and wellness journals are intended for personal documentation and reflection. They are not substitutes for professional medical advice or healthcare services.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. How We Use Customer Information</h2>
              <p>Information collected through our business channels may be used for:</p>
              <ul className="policy-bullet-list">
                <li>Processing and fulfilling customer orders.</li>
                <li>Shipping and delivery management.</li>
                <li>Responding to enquiries and support requests.</li>
                <li>Communicating order confirmations and updates.</li>
                <li>Managing returns, refunds and replacements.</li>
                <li>Improving our products and customer experience.</li>
                <li>Sending promotional communications where appropriate consent has been obtained.</li>
                <li>Meeting applicable legal and regulatory obligations.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Sharing of Personal Information</h2>
              <p>We do not sell or rent customer personal information.</p>
              <p>We may share necessary information with trusted third-party service providers, including:</p>
              <ul className="policy-bullet-list">
                <li>Payment gateway providers.</li>
                <li>Courier and logistics partners.</li>
                <li>Website hosting and maintenance providers.</li>
                <li>Technology and analytics service providers.</li>
                <li>Professional advisers and legal authorities where legally required.</li>
              </ul>
              <p>Such sharing will be limited to legitimate business purposes and applicable legal requirements.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Cookies and Website Tracking</h2>
              <p>
                Our website may use cookies and similar technologies to improve browsing experience, understand website traffic, maintain functionality and support marketing activities.
              </p>
              <p>
                Visitors may manage their cookie preferences through available website controls and browser settings.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Data Security</h2>
              <p>
                We take reasonable technical and organisational measures to protect personal information against unauthorised access, misuse, loss, alteration or disclosure.
              </p>
              <p>
                While we make reasonable efforts to safeguard information, no electronic storage or internet transmission method can guarantee absolute security.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. Data Retention and Deletion</h2>
              <p>
                We retain personal information only for as long as reasonably necessary to fulfil the purposes for which it was collected, including legal, accounting and regulatory requirements.
              </p>
              <p>
                Customers may request access, correction or deletion of their personal information, subject to applicable laws and legitimate retention obligations.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Your Privacy Rights</h2>
              <p>Subject to applicable laws, customers may have the right to:</p>
              <ul className="policy-bullet-list">
                <li>Request information about personal data collected.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of personal information.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Raise concerns about the handling of personal information.</li>
              </ul>
              <p>Requests can be submitted using our official contact details.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">12. Third-Party Websites</h2>
              <p>
                Our website or promotional communications may contain links to external websites or services. The Gifted Pencil is not responsible for the privacy practices or content of third-party platforms.
              </p>
              <p>
                Customers are encouraged to review the privacy policies of such platforms before sharing personal information.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">13. Updates to This Policy</h2>
              <p>
                We may revise this Privacy Policy periodically to reflect changes in our products, business practices, technology or applicable legal requirements.
              </p>
              <p>The latest version will be made available through our official website or communication channels.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">14. Contact Information</h2>
              <p>For privacy-related questions, concerns or requests, please contact:</p>
              <div className="policy-contact-card">
                <p className="policy-contact-brand">The Gifted Pencil</p>
                <p>
                  <strong>Email:</strong> [Insert Official Email Address]
                </p>
                <p>
                  <strong>Website:</strong> [Insert Official Website]
                </p>
                <p>
                  <strong>Business Address:</strong> [Insert Registered Business Address]
                </p>
                <p>
                  <strong>Country:</strong> India
                </p>
              </div>
            </section>

            <div className="policy-divider" aria-hidden="true" />

            {/* OUR COMMITMENT */}
            <section className="policy-special-block">
              <h2 className="policy-special-title">OUR COMMITMENT</h2>
              <p>At The Gifted Pencil, we believe every individual has a story worth writing.</p>
              <p>
                From childhood dreams to adult aspirations, from pregnancy milestones to personal transformations, every page holds something meaningful.
              </p>
              <p>
                We are committed to respecting your privacy and creating a space where you can write, reflect, imagine and grow.
              </p>
              <p className="policy-signature">The Gifted Pencil</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  )
}

export default PrivacyPolicy
