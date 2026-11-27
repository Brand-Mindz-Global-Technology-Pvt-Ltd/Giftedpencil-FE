import React, { useState, useEffect, useRef } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  ShoppingCart,
  Headphones,
  MessageSquare,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import heroBannerImg from '../assets/Home/Hero-banner.png'
import CTA from '../components/home/CTA'
import { contactApi } from '../services/api'

const enquiryOptions = [
  'General Enquiry',
  'Order Status & Tracking',
  'Product Support & Guidance',
  'Bulk & Corporate Gifting',
  'Feedback & Suggestions',
  'Other Questions',
]

const ContactUs: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [enquiryType, setEnquiryType] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errors, setErrors] = useState<{
    firstName?: string
    email?: string
    phone?: string
    enquiryType?: string
    message?: string
  }>({})

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const formRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleTopicSelect = (topic: string) => {
    setEnquiryType(topic)
    if (errors.enquiryType) {
      setErrors((prev) => ({ ...prev, enquiryType: undefined }))
    }
    scrollToForm()
  }

  const validate = () => {
    const newErrors: {
      firstName?: string
      email?: string
      phone?: string
      enquiryType?: string
      message?: string
    } = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const indianMobileRegex = /^(\+91|91|0)?[6-9]\d{9}$/

    if (!firstName.trim()) {
      newErrors.firstName = 'Please enter your first name.'
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long.'
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (phone.trim()) {
      const cleaned = phone.trim().replace(/[\s-]/g, '')
      if (!indianMobileRegex.test(cleaned)) {
        newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.'
      }
    }

    if (!enquiryType) {
      newErrors.enquiryType = 'Please select an enquiry type.'
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter your message.'
    } else if (message.trim().length < 5) {
      newErrors.message = 'Your message must be at least 5 characters long.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    if (isSubmitting) return

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await contactApi.submitContact({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        name: lastName.trim() ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim(),
        email: email.trim(),
        phone: phone.trim() ? phone.trim().replace(/[\s-]/g, '').slice(-10) : undefined,
        enquiryType: enquiryType,
        enquiry_type: enquiryType,
        subject: enquiryType,
        message: message.trim(),
      })

      setStatusMessage({
        type: 'success',
        text: response.message || 'Thank you for reaching out! Your message has been received. Our team will get back to you within 24 hours.',
      })

      // Reset form fields only on success
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setEnquiryType('')
      setMessage('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.'
      setStatusMessage({
        type: 'error',
        text: msg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      {/* 1. Top Banner (Hero) */}
      <section
        className="contact-banner"
        style={{ backgroundImage: `url(${heroBannerImg})` }}
        aria-label="The Gifted Pencil Contact Banner"
      >
        <div className="contact-banner-inner">
          <div className="contact-banner-content reveal-on-scroll">
            <div className="contact-badge">
              <span className="contact-badge-line" aria-hidden="true" />
              <span className="contact-badge-text">GET IN TOUCH</span>
              <span className="contact-badge-line" aria-hidden="true" />
            </div>

            <h1 className="contact-heading">
              <span className="contact-heading-line1">Let's</span>
              <span className="contact-heading-line2">
                <span>Connect</span>
                <span className="contact-heart-flourish-wrap" aria-hidden="true">
                  <svg
                    className="contact-heart-flourish"
                    viewBox="0 0 110 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 28 35 C 16 25, 6 15, 12 7 C 18 -1, 26 3, 30 11 C 34 3, 42 -1, 48 7 C 54 15, 42 25, 30 35 C 36 39, 50 41, 68 37 C 86 33, 98 35, 108 38"
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="contact-description">
              We'd love to hear from you! Whether you have a question, need support, or simply
              want to share your thoughts, our team is here to help.
            </p>

            <div className="contact-cta-wrapper">
              <button
                type="button"
                className="contact-reach-btn"
                onClick={scrollToForm}
                aria-label="Reach Out Today"
              >
                <span>Reach Out Today</span>
                <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Section (Contact Form & Contact Details Cards) */}
      <section className="contact-main-section" ref={formRef} id="contact-form">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Left Card: Contact Form */}
            <div className="contact-card contact-form-card reveal-scale">
              <div className="contact-card-badge-wrap">
                <span className="contact-card-badge">Send Us a Message</span>
              </div>

              <h2 className="contact-card-title">Contact Form</h2>
              <p className="contact-card-desc">
                Have a question, suggestion, or need assistance? Fill out the form below and
                we'll get back to you as soon as possible.
              </p>

              {statusMessage && (
                <div
                  className={`contact-status-banner ${
                    statusMessage.type === 'error' ? 'is-error' : 'is-success'
                  }`}
                  role="status"
                >
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {/* Row 1: First Name & Last Name */}
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <input
                      type="text"
                      id="contact-first-name"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                        if (errors.firstName)
                          setErrors((prev) => ({ ...prev, firstName: undefined }))
                      }}
                      placeholder="First Name *"
                      className={`contact-input ${errors.firstName ? 'has-error' : ''}`}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <span className="contact-field-error" role="alert">
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="contact-form-group">
                    <input
                      type="text"
                      id="contact-last-name"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name *"
                      className="contact-input"
                    />
                  </div>
                </div>

                {/* Row 2: Email Address */}
                <div className="contact-form-group">
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    placeholder="Email Address *"
                    className={`contact-input ${errors.email ? 'has-error' : ''}`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <span className="contact-field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Row 3: Enquiry Type Dropdown */}
                <div className="contact-form-group">
                  <div className="contact-select-wrapper">
                    <select
                      id="contact-enquiry-type"
                      name="enquiryType"
                      value={enquiryType}
                      onChange={(e) => {
                        setEnquiryType(e.target.value)
                        if (errors.enquiryType)
                          setErrors((prev) => ({ ...prev, enquiryType: undefined }))
                      }}
                      className={`contact-select ${errors.enquiryType ? 'has-error' : ''} ${
                        !enquiryType ? 'is-placeholder' : ''
                      }`}
                      aria-invalid={!!errors.enquiryType}
                    >
                      <option value="" disabled>
                        Enquiry Type *
                      </option>
                      {enquiryOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="contact-select-arrow" size={17} aria-hidden="true" />
                  </div>
                  {errors.enquiryType && (
                    <span className="contact-field-error" role="alert">
                      {errors.enquiryType}
                    </span>
                  )}
                </div>

                {/* Row 4: Your Message */}
                <div className="contact-form-group">
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      if (errors.message)
                        setErrors((prev) => ({ ...prev, message: undefined }))
                    }}
                    placeholder="Your Message *"
                    className={`contact-textarea ${errors.message ? 'has-error' : ''}`}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <span className="contact-field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={17} strokeWidth={2.2} aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Card: Contact Details */}
            <div className="contact-card contact-details-card">
              <div className="contact-card-badge-wrap">
                <span className="contact-card-badge">Get In Touch</span>
              </div>

              <h2 className="contact-card-title">Contact Details</h2>
              <p className="contact-card-desc">
                Prefer to reach us directly? Here are other ways to connect with The Gifted
                Pencil.
              </p>

              <div className="contact-info-list">
                {/* 1. Email Us */}
                <div className="contact-info-card">
                  <div className="contact-info-icon-wrap" aria-hidden="true">
                    <Mail size={22} strokeWidth={2} />
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">Email Us</h3>
                    <a
                      href="mailto:support@thegiftedpencil.com"
                      className="contact-info-main"
                    >
                      support@thegiftedpencil.com
                    </a>
                    <span className="contact-info-sub">We usually reply within 24 hours.</span>
                  </div>
                </div>

                {/* 2. Call Us */}
                <div className="contact-info-card">
                  <div className="contact-info-icon-wrap" aria-hidden="true">
                    <Phone size={22} strokeWidth={2} />
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">Call Us</h3>
                    <a href="tel:+919876543210" className="contact-info-main">
                      +91 98765 43210
                    </a>
                    <span className="contact-info-sub">Mon – Sat, 10:00 AM – 6:00 PM (IST)</span>
                  </div>
                </div>

                {/* 3. Our Office */}
                <div className="contact-info-card">
                  <div className="contact-info-icon-wrap" aria-hidden="true">
                    <MapPin size={22} strokeWidth={2} />
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">Our Office</h3>
                    <div className="contact-info-address">
                      <p className="contact-info-address-line">The Gifted Pencil</p>
                      <p className="contact-info-address-line">No. 42, Paperleaf Avenue,</p>
                      <p className="contact-info-address-line">
                        Bengaluru, Karnataka – 560001, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How Can We Help You?" Section */}
      <section className="contact-help-section" aria-label="How Can We Help You">
        <div className="contact-container">
          <div className="contact-help-header">
            <div className="contact-help-title-wrap">
              <span className="contact-help-line" aria-hidden="true" />
              <h2 className="contact-help-title">How Can We Help You?</h2>
              <span className="contact-help-line" aria-hidden="true" />
            </div>
            <p className="contact-help-desc">
              Choose the topic that best fits your enquiry, and we'll make sure it reaches
              the right team.
            </p>
          </div>

          <div className="contact-help-grid">
            {/* Card 1: Order Enquiry */}
            <div className="contact-help-card reveal-on-scroll stagger-1">
              <div className="contact-help-icon-wrap" aria-hidden="true">
                <ShoppingCart size={24} strokeWidth={1.8} />
              </div>
              <h3 className="contact-help-card-title">Order Enquiry</h3>
              <p className="contact-help-card-desc">
                Have a question about your order, tracking, or delivery? We're here to help.
              </p>
              <button
                type="button"
                className="contact-help-card-btn"
                onClick={() => handleTopicSelect('Order Status & Tracking')}
              >
                <span>Get Order Support</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>

            {/* Card 2: Product Support */}
            <div className="contact-help-card reveal-on-scroll stagger-2">
              <div className="contact-help-icon-wrap" aria-hidden="true">
                <Headphones size={24} strokeWidth={1.8} />
              </div>
              <h3 className="contact-help-card-title">Product Support</h3>
              <p className="contact-help-card-desc">
                Need help choosing a journal or have a product-related question? Let us guide
                you.
              </p>
              <button
                type="button"
                className="contact-help-card-btn"
                onClick={() => handleTopicSelect('Product Support & Guidance')}
              >
                <span>Product Help</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>

            {/* Card 3: Share Feedback */}
            <div className="contact-help-card reveal-on-scroll stagger-3">
              <div className="contact-help-icon-wrap" aria-hidden="true">
                <MessageSquare size={24} strokeWidth={1.8} />
              </div>
              <h3 className="contact-help-card-title">Share Feedback</h3>
              <p className="contact-help-card-desc">
                We'd love to hear your thoughts, ideas, or suggestions. Your feedback helps us
                grow.
              </p>
              <button
                type="button"
                className="contact-help-card-btn"
                onClick={() => handleTopicSelect('Feedback & Suggestions')}
              >
                <span>Give Feedback</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shared CTA Banner (Adapted with Contact page text) */}
      <CTA
        heading="We're Here for You"
        description="Questions, ideas, or just a note to say hello — we're always happy to hear from our journaling community."
        buttonText="Contact Our Team →"
        onButtonClick={scrollToForm}
      />
    </div>
  )
}

export default ContactUs
