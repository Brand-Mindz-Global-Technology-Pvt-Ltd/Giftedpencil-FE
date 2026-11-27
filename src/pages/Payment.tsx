import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import PaymentBanner from '../components/payment/PaymentBanner'
import PaymentSteps from '../components/payment/PaymentSteps'
import PaymentMethods, { type PaymentMethodType } from '../components/payment/PaymentMethods'
import PaymentCardDetails from '../components/payment/PaymentCardDetails'
import PaymentBillingAddress from '../components/payment/PaymentBillingAddress'
import PaymentOrderSummary from '../components/payment/PaymentOrderSummary'
import PaymentSecurityTrust from '../components/payment/PaymentSecurityTrust'
import PaymentTrustBar from '../components/payment/PaymentTrustBar'
import { useCart } from '../context/CartContext'
import { ordersApi, type CheckoutOrderPayload } from '../services/api'
import type { DeliveryAddress } from '../types/address'

const Payment: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, total, refreshCart } = useCart()

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  // Alternate payment states
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')
  const [selectedWallet, setSelectedWallet] = useState('Paytm')

  // Submission & Error handling states
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Resolve selected address from navigation state or sessionStorage
  const resolvedAddress = ((): DeliveryAddress | null => {
    const stateAddr = (location.state as { selectedAddress?: DeliveryAddress } | null)?.selectedAddress
    if (stateAddr?.name && stateAddr?.addressLine) {
      return stateAddr
    }
    try {
      const saved = sessionStorage.getItem('tgp_selected_address')
      if (saved) {
        const parsed = JSON.parse(saved) as DeliveryAddress
        if (parsed?.name && parsed?.addressLine) {
          return parsed
        }
      }
    } catch {
      // ignore
    }
    return null
  })()

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      setOrderError('Your cart is empty. Please add journals to your cart before placing an order.')
      return
    }

    if (isPlacingOrder) {
      return // Prevent duplicate clicks and race conditions
    }

    setIsPlacingOrder(true)
    setOrderError(null)

    try {
      // Build checkout payload conforming to backend OrderValidator.validateCheckoutOrder
      const payload: CheckoutOrderPayload = {
        payment_method:
          selectedMethod === 'card'
            ? 'Card'
            : selectedMethod === 'upi'
              ? 'UPI'
              : selectedMethod === 'netbanking'
                ? 'NetBanking'
                : selectedMethod === 'wallets'
                  ? 'Wallet'
                  : 'Online',
      }

      if (resolvedAddress?.id) {
        // Pass saved address_id if available
        payload.address_id = resolvedAddress.id
      }

      // If address components are present, provide snapshot fields as fallback
      if (resolvedAddress) {
        payload.customer_name = resolvedAddress.name
        payload.phone = resolvedAddress.phone.replace(/[\s-]/g, '').slice(-10) || '9876543210'
        payload.house_details = resolvedAddress.house_details || resolvedAddress.addressLine.split(',')[0] || resolvedAddress.addressLine
        payload.street_area = resolvedAddress.street_area || resolvedAddress.addressLine.split(',')[1]?.trim() || 'Main Area'
        payload.city = resolvedAddress.city || 'Tirunelveli'
        payload.state = resolvedAddress.state || 'Tamil Nadu'
        payload.pincode = resolvedAddress.pincode || resolvedAddress.addressLine.match(/\b\d{6}\b/)?.[0] || '627007'
        payload.address = resolvedAddress.addressLine
      }

      // Execute atomic checkout via POST /api/orders/checkout
      const placedOrder = await ordersApi.checkout(payload)

      // Refresh cart context to reflect server-side cleared cart
      await refreshCart()

      // Clear cached selected address from session
      try {
        sessionStorage.removeItem('tgp_selected_address')
      } catch {
        // ignore
      }

      // Navigate to order confirmation page with full server-verified order data
      navigate('/order-confirmation', {
        state: { order: placedOrder },
        replace: true,
      })
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unable to complete order checkout. Please try again.'
      setOrderError(msg)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="payment-page">
      {/* 1. Top Banner */}
      <PaymentBanner />

      {/* 2. Main Content Area */}
      <main className="payment-main-section">
        <div className="payment-main-container">
          <form onSubmit={handlePlaceOrder} className="payment-layout-form">
            <div className="payment-columns-grid">
              {/* Left Column: Stepper, Methods, Method Details, Billing Address */}
              <div className="payment-left-col reveal-slide-left">
                <div className="payment-card payment-primary-card">
                  {/* Step Progress */}
                  <PaymentSteps />

                  {/* Payment Error Alert */}
                  {orderError && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        marginBottom: '16px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#991B1B',
                        fontSize: '13.5px',
                      }}
                      role="alert"
                    >
                      <AlertCircle size={18} color="#DC2626" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  {/* Payment Methods Tabs */}
                  <PaymentMethods
                    selectedMethod={selectedMethod}
                    onSelectMethod={setSelectedMethod}
                  />

                  {/* Dynamic Method Form */}
                  {selectedMethod === 'card' && (
                    <PaymentCardDetails
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      expiryDate={expiryDate}
                      setExpiryDate={setExpiryDate}
                      cvv={cvv}
                      setCvv={setCvv}
                      cardholderName={cardholderName}
                      setCardholderName={setCardholderName}
                    />
                  )}

                  {selectedMethod === 'upi' && (
                    <div className="payment-card-details-block">
                      <h3 className="payment-card-details-title">Pay via UPI</h3>
                      <div className="payment-field-group">
                        <label htmlFor="upiIdInput" className="payment-field-label">
                          UPI ID / VPA <span className="payment-required">*</span>
                        </label>
                        <input
                          id="upiIdInput"
                          type="text"
                          className="payment-text-input"
                          placeholder="username@bank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <div className="payment-card-details-block">
                      <h3 className="payment-card-details-title">Select Net Banking</h3>
                      <div className="payment-field-group">
                        <label htmlFor="bankSelect" className="payment-field-label">
                          Popular Banks <span className="payment-required">*</span>
                        </label>
                        <select
                          id="bankSelect"
                          className="payment-select-input"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Other Bank">Other Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'wallets' && (
                    <div className="payment-card-details-block">
                      <h3 className="payment-card-details-title">Select Wallet</h3>
                      <div className="payment-field-group">
                        <label htmlFor="walletSelect" className="payment-field-label">
                          Supported Wallets <span className="payment-required">*</span>
                        </label>
                        <select
                          id="walletSelect"
                          className="payment-select-input"
                          value={selectedWallet}
                          onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                          <option value="Paytm">Paytm Wallet</option>
                          <option value="PhonePe">PhonePe Wallet</option>
                          <option value="Amazon Pay">Amazon Pay Balance</option>
                          <option value="Mobikwik">Mobikwik</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Billing Address */}
                  <PaymentBillingAddress />
                </div>
              </div>

              {/* Right Column: Order Summary & Trust Card */}
              <div className="payment-right-col reveal-slide-right">
                <PaymentOrderSummary />
                <PaymentSecurityTrust />
              </div>
            </div>

            {/* Full-Width Place Order Button */}
            <div className="payment-place-order-wrapper">
              <button
                type="submit"
                className="payment-place-order-btn"
                disabled={items.length === 0 || isPlacingOrder}
                aria-label={`Place Order for Rupees ${total.toLocaleString('en-IN')}`}
                style={{
                  opacity: isPlacingOrder ? 0.75 : 1,
                  cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
                }}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} strokeWidth={2.2} />
                    <span>Place Order &ndash; &#8377;{total.toLocaleString('en-IN')}</span>
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Customer Guarantees Trust Bar */}
          <PaymentTrustBar />
        </div>
      </main>
    </div>
  )
}

export default Payment
