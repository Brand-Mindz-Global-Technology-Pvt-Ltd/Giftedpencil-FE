import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { useAuth } from "../context/Authcontext";
import { ProfileProvider } from "../context/ProfileContext";
import Breadcrumbs from "./Breadcrumbs";
import "../index.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F5]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 lg:w-64 shrink-0">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 sm:w-72
          bg-white shadow-2xl border-r border-[#FAECE0]
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-2.5 sm:p-4 lg:p-5 min-w-0 overflow-y-auto">
        <ProfileProvider>
          <Topbar onMenu={() => setSidebarOpen(true)} />
          <main className="flex-1 px-1 sm:px-2 py-3">
            <Breadcrumbs />
            <div key={location.pathname} className="mt-1 admin-page-entrance">
              <Outlet />
            </div>
          </main>
        </ProfileProvider>
      </div>
    </div>
  );
}
