import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Layout from '../components/common/Layout/Layout'

const ShippingPolicy = () => {
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
          <span className="policy-breadcrumb-current">Shipping &amp; Delivery Policy</span>
        </div>

        <article className="policy-container reveal-on-scroll">
          <header className="policy-header">
            <span className="policy-brand-tag">The Gifted Pencil</span>
            <h1 className="policy-title">SHIPPING &amp; DELIVERY POLICY</h1>
            <div className="policy-divider" aria-hidden="true" />
          </header>

          <div className="policy-body">
            <p className="policy-intro">
              At The Gifted Pencil, we believe every journal carries a meaningful journey. We are committed to ensuring that your order is carefully packed and delivered to your doorstep safely.
            </p>
            <p>
              Please read our Shipping and Delivery Policy to understand how we process and deliver your orders.
            </p>

            <section className="policy-section">
              <h2 className="policy-section-title">1. Order Processing Time</h2>
              <p>All orders are processed after successful payment confirmation.</p>
              <p>Standard orders are generally processed within 2–4 business days.</p>
              <p>
                Personalised, customised or made-to-order journals may require additional processing time.
              </p>
              <p>
                Orders placed on Sundays, public holidays or non-working days will be processed on the next working day.
              </p>
              <p>
                Processing time may vary during festive seasons, promotional campaigns or periods of high order volume.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Shipping and Delivery Timeline</h2>
              <p>We aim to deliver your orders within the following estimated timelines:</p>

              {/* Delivery Timeline Table */}
              <div className="policy-table-wrapper">
                <table className="policy-table">
                  <thead>
                    <tr>
                      <th scope="col">Delivery Location</th>
                      <th scope="col">Estimated Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tamil Nadu</td>
                      <td>3–5 business days</td>
                    </tr>
                    <tr>
                      <td>Other Indian states</td>
                      <td>5–8 business days</td>
                    </tr>
                    <tr>
                      <td>Remote locations</td>
                      <td>7–12 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Delivery timelines are estimates and may vary depending on the delivery location, courier availability, weather conditions and other unforeseen circumstances.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. Shipping Charges</h2>
              <p>Shipping charges, if applicable, will be displayed during checkout.</p>
              <p>
                Shipping fees may vary based on delivery location, order weight, dimensions and courier service.
              </p>
              <p>
                Promotional free-shipping offers may be available for selected orders or campaigns.
              </p>
              <p>
                Any applicable additional delivery charges will be communicated before order confirmation.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. Order Tracking</h2>
              <p>
                Once your order is dispatched, you will receive a shipping confirmation with tracking details, wherever supported by the courier partner.
              </p>
              <p>You can use the tracking information to monitor your shipment until delivery.</p>
              <p>
                If you experience difficulties tracking your order, please contact our customer support team.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Delivery Address</h2>
              <p>Customers are responsible for providing accurate and complete delivery information at checkout.</p>
              <p>Please ensure that the following details are correct:</p>
              <ul className="policy-bullet-list">
                <li>Recipient&apos;s full name.</li>
                <li>Complete delivery address.</li>
                <li>PIN code.</li>
                <li>Valid contact number.</li>
                <li>Any necessary delivery instructions.</li>
              </ul>
              <p>
                The Gifted Pencil will not be responsible for delays or failed deliveries resulting from incorrect or incomplete addresses provided by customers, subject to applicable consumer rights.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. Delayed or Undelivered Orders</h2>
              <p>
                While we make every effort to deliver orders within the estimated timeline, delays may occur due to:
              </p>
              <ul className="policy-bullet-list">
                <li>Courier or logistics issues.</li>
                <li>Weather conditions.</li>
                <li>Public holidays or festive periods.</li>
                <li>Natural disasters or unforeseen circumstances.</li>
                <li>Incorrect delivery information.</li>
                <li>Other circumstances beyond our reasonable control.</li>
              </ul>
              <p>
                If your order has not arrived within the estimated delivery period, please contact us. We will coordinate with our delivery partner and assist you in resolving the issue.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Damaged Packages</h2>
              <p>We take care to pack every journal securely before dispatch.</p>
              <p>If your order arrives damaged, please:</p>
              <ul className="policy-bullet-list">
                <li>Notify us within 48 hours of receiving the package.</li>
                <li>Share your order number.</li>
                <li>
                  Provide photographs or an unboxing video showing the damaged packaging or product, where available.
                </li>
                <li>Allow our team to review the issue and arrange an appropriate resolution.</li>
              </ul>
              <p>
                Depending on the circumstances, we may offer a replacement or refund in accordance with our Return and Refund Policy and applicable law.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Incorrect or Missing Products</h2>
              <p>
                If you receive an incorrect product or find that an item is missing from your order, please contact us within 48 hours of delivery.
              </p>
              <p>Our team will investigate the issue and arrange an appropriate resolution.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Multiple Shipments</h2>
              <p>
                For orders containing multiple products, we may dispatch items in separate packages depending on stock availability, packaging requirements or fulfilment arrangements.
              </p>
              <p>Where applicable, separate tracking details will be shared.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. International Shipping</h2>
              <p>International shipping may be offered for selected products and destinations.</p>
              <p>International customers should note that:</p>
              <ul className="policy-bullet-list">
                <li>Shipping charges and delivery timelines vary by destination.</li>
                <li>
                  Customs duties, import taxes and other applicable charges may be payable by the customer unless otherwise stated.
                </li>
                <li>Delivery is subject to customs clearance and local import regulations.</li>
                <li>Certain products may not be eligible for international shipping.</li>
                <li>International orders will be accepted only where shipping services are available.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Cash on Delivery</h2>
              <p>
                Cash on Delivery (COD) may be offered for selected locations and orders, depending on availability.
              </p>
              <p>Any applicable COD charges will be displayed during checkout.</p>
              <p>
                Customers are requested to provide a valid contact number and ensure availability to receive the shipment.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">12. Contact Us</h2>
              <p>For shipping, tracking or delivery-related enquiries, please contact:</p>
              <div className="policy-contact-card">
                <p className="policy-contact-brand">The Gifted Pencil</p>
                <p>
                  <strong>Email:</strong> thegiftedpencilteam@gmail.com
                </p>
                <p>
                  <strong>Website:</strong> www.thegiftedpencil.com
                </p>
                <p>
                  <strong>Business Address:</strong> [Insert Business Address]
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
              <p>Every journal is created with care, and every order deserves the same attention.</p>
              <p>
                From the moment you place your order until it reaches your doorstep, we strive to make your shopping experience smooth, reliable and meaningful.
              </p>
              <p>Thank you for choosing The Gifted Pencil.</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  )
}

export default ShippingPolicy
