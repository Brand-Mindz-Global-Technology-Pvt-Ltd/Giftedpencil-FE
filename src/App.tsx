import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import Home from './pages/Home'
import ProductDetails from './components/product/ProductDetails'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import ReturnRefundPolicy from './pages/ReturnRefundPolicy'
import './App.css'

function App() {
  return (
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
        <Route path="/product-details/:slug" element={<ProductDetails />} />
        <Route
          path="/product-details"
          element={<Navigate to="/product-details/the-gifted-pencil" replace />}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
