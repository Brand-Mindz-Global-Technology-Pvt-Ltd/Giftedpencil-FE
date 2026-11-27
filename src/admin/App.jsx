import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/Authcontext.jsx";
import "./index.css";

/* ---------------- Lazy Imports ---------------- */
const Loginpage = lazy(() => import("./pages/auth/Loginpage"));
const Registerpage = lazy(() => import("./pages/auth/Registerpage"));
const ForgotpasswordPage = lazy(() => import("./pages/auth/ForgotpasswordPage"));
const ResetpasswordPage = lazy(() => import("./pages/auth/ResetpasswordPage"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

export default function AdminApp() {
  return (
    <div className="admin-root min-h-screen bg-[#FAF7F5] text-[#1E293B]">
      <AuthProvider>
        <Suspense fallback={<div className="p-6 text-slate-700">Loading Admin...</div>}>
          <Routes>
            <Route path="" element={<Navigate to="login" replace />} />
            <Route path="/" element={<Navigate to="login" replace />} />
            <Route path="login" element={<Loginpage />} />
            <Route path="register" element={<Registerpage />} />
            <Route path="forgotpassword" element={<ForgotpasswordPage />} />
            <Route path="resetpassword/:token" element={<ResetpasswordPage />} />

            {/* Admin Dashboard & Management Routes */}
            <Route element={<AdminLayout />}>
              <Route path="*" element={<AdminRoutes />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}
