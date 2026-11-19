import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Layout from '../components/common/Layout/Layout'

const ReturnRefundPolicy = () => {
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
          <span className="policy-breadcrumb-current">
            Return, Refund, Replacement &amp; Cancellation Policy
          </span>
        </div>

        <article className="policy-container">
          <header className="policy-header">
            <span className="policy-brand-tag">The Gifted Pencil</span>
            <h1 className="policy-title">RETURN, REFUND, REPLACEMENT &amp; CANCELLATION POLICY</h1>
            <div className="policy-divider" aria-hidden="true" />
          </header>

          <div className="policy-body">
            <p className="policy-intro">
              At The Gifted Pencil, every journal is thoughtfully created to become a meaningful part of your personal journey. We take care to ensure that every product reaches you in good condition.
            </p>
            <p>
              Please read our Return, Refund, Replacement and Cancellation Policy before placing an order.
            </p>

            <section className="policy-section">
              <h2 className="policy-section-title">1. Order Cancellation</h2>
              <p>
                Customers may request cancellation within 12 hours of placing an order, provided the order has not been processed, packed or dispatched.
              </p>
              <p>Once an order has been dispatched, cancellation requests will not be accepted.</p>
              <p>
                Customised, personalised or made-to-order journals cannot be cancelled once production has commenced.
              </p>
              <p>
                Approved cancellations will be refunded to the original payment method, subject to applicable payment processing timelines.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Return Policy</h2>
              <p>We accept return requests only under the following circumstances:</p>
              <ul className="policy-bullet-list">
                <li>The product received is damaged.</li>
                <li>The product received has a manufacturing or printing defect.</li>
                <li>The wrong product has been delivered.</li>
                <li>
                  The product received is significantly different from the description or specifications provided at the time of purchase.
                </li>
              </ul>
              <p>Customers must notify us within 48 hours of receiving the product.</p>
              <p>
                The product should be unused and, wherever possible, returned with its original packaging and accompanying accessories.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. Non-Returnable Products</h2>
              <p>
                The following products are generally not eligible for return or exchange unless they arrive damaged, defective or incorrect:
              </p>
              <ul className="policy-bullet-list">
                <li>Journals and notebooks that have been used or written in.</li>
                <li>Personalised or customised journals.</li>
                <li>Digital downloads and printable journals once accessed or downloaded.</li>
                <li>Products damaged due to improper handling or usage by the customer.</li>
                <li>Products returned without prior approval.</li>
              </ul>
              <p>Nothing in this policy limits any mandatory consumer rights available under applicable law.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. Damaged or Defective Products</h2>
              <p>If your order arrives damaged, defective or incorrect:</p>
              <ul className="policy-bullet-list">
                <li>Contact us within 48 hours of delivery.</li>
                <li>Share your order number and registered contact details.</li>
                <li>Provide clear photographs or an unboxing video showing the issue, where available.</li>
                <li>Our customer support team will review the request.</li>
                <li>Once approved, we will arrange a suitable replacement or refund.</li>
              </ul>
              <p>We recommend retaining the original packaging until your request has been resolved.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Refund Policy</h2>
              <p>Refunds may be approved in the following circumstances:</p>
              <ul className="policy-bullet-list">
                <li>An order is successfully cancelled before dispatch.</li>
                <li>A product is confirmed to be damaged or defective and a replacement is unavailable.</li>
                <li>An incorrect product has been delivered and a suitable replacement cannot be arranged.</li>
                <li>
                  An order cannot be fulfilled due to stock unavailability or other reasons attributable to us.
                </li>
                <li>Any other circumstance where a refund is required under applicable law.</li>
              </ul>
              <p>Approved refunds will generally be processed to the original payment method.</p>
              <p>
                Please allow 5–10 business days after refund approval for the amount to reflect in your account, depending on your bank or payment provider.
              </p>
              <p>
                Shipping charges, where applicable, will be refunded in accordance with the circumstances of the return and applicable law.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. Replacement Policy</h2>
              <p>Where a product is eligible for replacement:</p>
              <ul className="policy-bullet-list">
                <li>Replacement requests must be submitted within 48 hours of delivery.</li>
                <li>The issue must be verified by our customer support team.</li>
                <li>Replacement will be subject to product availability.</li>
                <li>
                  If the same product is unavailable, we may offer an alternative with the customer&apos;s consent or process an eligible refund.
                </li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Shipping and Return Costs</h2>
              <p>
                If the return or replacement is due to our error, including damaged, defective or incorrectly delivered products, we will bear the reasonable return shipping costs.
              </p>
              <p>
                For other approved returns, shipping costs will be handled in accordance with the applicable return arrangement and consumer protection requirements.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Orders Not Delivered</h2>
              <p>
                If an order is not delivered within the estimated delivery period, customers may contact our support team.
              </p>
              <p>We will coordinate with the delivery partner to investigate the shipment.</p>
              <p>
                If the shipment is confirmed lost or undeliverable, we will arrange a suitable replacement or refund, as applicable.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Digital Products</h2>
              <p>For digital journals, printable templates and downloadable products:</p>
              <ul className="policy-bullet-list">
                <li>
                  Orders cannot generally be cancelled or refunded once the digital content has been delivered or accessed.
                </li>
                <li>
                  If a file is corrupted, inaccessible or different from the purchased product, customers may contact us for technical assistance or an appropriate resolution.
                </li>
                <li>
                  Refunds will be considered where required by applicable law or where the issue cannot reasonably be resolved.
                </li>
              </ul>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. How to Request a Return or Refund</h2>
              <p>Please contact us using the details below:</p>
              <div className="policy-contact-card">
                <p>
                  <strong>Brand:</strong> The Gifted Pencil
                </p>
                <p>
                  <strong>Email:</strong> [Insert Official Email Address]
                </p>
                <p>
                  <strong>Website:</strong> [Insert Website URL]
                </p>
                <p>
                  <strong>Subject:</strong> Return / Refund / Replacement Request
                </p>
              </div>
              <p>Please include:</p>
              <ul className="policy-bullet-list">
                <li>Order number.</li>
                <li>Customer name.</li>
                <li>Registered phone number or email.</li>
                <li>Reason for the request.</li>
                <li>Photographs or supporting evidence, where applicable.</li>
              </ul>
              <p>Our team will review your request and communicate the next steps.</p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Policy Updates</h2>
              <p>
                The Gifted Pencil reserves the right to update this policy to reflect changes in business operations or applicable legal requirements.
              </p>
              <p>The latest version will be published on our official website.</p>
            </section>

            <div className="policy-divider" aria-hidden="true" />

            {/* OUR PROMISE */}
            <section className="policy-special-block">
              <h2 className="policy-special-title">OUR PROMISE</h2>
              <p>We want every journal from The Gifted Pencil to reach you in the best possible condition.</p>
              <p>
                Your trust matters to us, and we are committed to providing a fair, transparent and customer-friendly shopping experience.
              </p>
              <p className="policy-signature">The Gifted Pencil</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  )
}

export default ReturnRefundPolicy
