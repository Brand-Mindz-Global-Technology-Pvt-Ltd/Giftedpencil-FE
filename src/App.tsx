import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Shop from './pages/Shop'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Profile from './pages/Profile'
import Payment from './pages/Payment'
import Address from './pages/Address'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProductDetails from './components/product/ProductDetails'
import OrderConfirmation from './pages/OrderConfirmation'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import ReturnRefundPolicy from './pages/ReturnRefundPolicy'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './App.css'

const AdminApp = lazy(() => import('./admin/App'))

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/cart"
                element={
                  <Layout>
                    <Cart />
                  </Layout>
                }
              />
              <Route
                path="/shop"
                element={
                  <Layout>
                    <Shop />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <AboutUs />
                  </Layout>
                }
              />
              <Route path="/about-us" element={<Navigate to="/about" replace />} />
              <Route
                path="/address"
                element={
                  <Layout>
                    <Address />
                  </Layout>
                }
              />
              <Route path="/delivery-address" element={<Navigate to="/address" replace />} />
              <Route
                path="/payment"
                element={
                  <Layout>
                    <Payment />
                  </Layout>
                }
              />
              <Route path="/checkout" element={<Navigate to="/payment" replace />} />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Wishlist />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="/my-wishlist" element={<Navigate to="/wishlist" replace />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <Layout>
                    <ContactUs />
                  </Layout>
                }
              />
              <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

              {/* Standalone Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/product-details/:slug" element={<ProductDetails />} />
              <Route
                path="/product-details"
                element={<Navigate to="/product-details/the-gifted-pencil" replace />}
              />
              <Route
                path="/order-confirmation"
                element={
                  <Layout>
                    <OrderConfirmation />
                  </Layout>
                }
              />

              {/* Policy Routes */}
              <Route path="/terms-and-conditions" element={<TermsConditions />} />
              <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/terms-conditions" element={<Navigate to="/terms-and-conditions" replace />} />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route
                path="/shipping-and-delivery-policy"
                element={<Navigate to="/shipping-policy" replace />}
              />
              <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />

              <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
              <Route
                path="/return-and-refund-policy"
                element={<Navigate to="/return-refund-policy" replace />}
              />
              <Route
                path="/return-policy"
                element={<Navigate to="/return-refund-policy" replace />}
              />

              {/* Office Admin Panel */}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<div className="p-6 text-slate-700 font-sans">Loading Admin...</div>}>
                    <AdminApp />
                  </Suspense>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
