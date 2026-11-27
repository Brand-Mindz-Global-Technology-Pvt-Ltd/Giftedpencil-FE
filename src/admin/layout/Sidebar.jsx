import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, X, ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";
import defaultLogo from "../assets/Imgaes/Logo.jpg";
import { navItems } from "./navItems";

export default function Sidebar({ onClose, onLogout }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [logo, setLogo] = useState(defaultLogo);
  const [logoLoading, setLogoLoading] = useState(true);

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const adminId = admin?.id;
  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_BASE_URL = `${BASE_URL}/settings`;

  const withAdminId = (path) =>
    adminId ? `${path}?id=${adminId}` : path;

  // Fetch company logo
  useEffect(() => {
    const fetchCompanyLogo = async () => {
      if (!adminId) {
        setLogoLoading(false);
        return;
      }
      try {
        setLogoLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/getcompany/${adminId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.success && response.data.data?.logo) {
          setLogo(response.data.data.logo);
        }
      } catch (err) {
        console.error('Error fetching company logo:', err);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchCompanyLogo();
  }, [adminId, token]);

  useEffect(() => {
    const activeParent = navItems.find(item =>
      item.children?.some(child => location.pathname === child.to)
    );
    if (activeParent) setOpenMenu(activeParent.label);
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenu(prev => (prev === label ? null : label));
  };

  return (
    <aside className="h-screen w-60 lg:w-64 bg-white border-r border-[#FAECE0] flex flex-col flex-shrink-0 select-none">

      {/* ================= LOGO HEADER ================= */}
      <header className="h-16 flex items-center justify-center relative border-b border-[#FAECE0] px-4 bg-white shrink-0">
        {logoLoading ? (
          <div className="h-10 w-36 bg-[#FAECE0]/40 animate-pulse rounded-md" />
        ) : (
          <div className="h-12 w-full flex items-center justify-center">
            <img
              src={logo || defaultLogo}
              alt="The Gifted Pencil"
              className="max-h-11 w-auto max-w-[190px] object-contain transition-all duration-200"
              onError={(e) => {
                e.currentTarget.src = defaultLogo;
              }}
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-3 md:hidden text-slate-500 hover:text-slate-800 p-2 hover:bg-[#FAF7F5] rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-slate-500 hover:text-[#7E3540]" />
        </button>
      </header>

      {/* ================= NAVIGATION ITEMS ================= */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenu === item.label;
            const hasActiveChild = item.children?.some(
              c => c.to === location.pathname
            );

            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  to={withAdminId(item.to)}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-3 px-3 py-2.5 
                    rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-[#7E3540] text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-[#FAF7F5] hover:text-[#7E3540]"}`
                  }
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon size={18} className="flex-shrink-0 transition-transform duration-150 group-hover:scale-105" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0"
                  />
                </NavLink>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    hasActiveChild
                      ? "bg-[#FFF7F1] text-[#7E3540] border border-[#FAECE0] font-semibold"
                      : "text-slate-700 hover:bg-[#FAF7F5] hover:text-[#7E3540]"
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <Icon size={18} className="flex-shrink-0 transition-transform duration-150 group-hover:scale-105" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 flex-shrink-0 ml-1.5 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    } ${hasActiveChild ? "text-[#7E3540]" : "text-slate-400"}`}
                  />
                </button>

                {/* Submenu */}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out
                    ${isOpen ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                >
                  <div className="ml-7 space-y-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.label}
                        to={withAdminId(child.to)}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center justify-between px-3 py-2 rounded-md 
                          text-xs sm:text-sm transition-all duration-150
                          ${isActive
                            ? "bg-[#7E3540] text-white font-semibold shadow-2xs"
                            : "text-slate-600 hover:bg-[#FAF7F5] hover:text-[#7E3540]"}`
                        }
                      >
                        <span className="truncate block">{child.label}</span>
                        <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0"
                        />
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* ================= SIGN OUT BUTTON (BOTTOM) ================= */}
      <div className="p-3 border-t border-[#FAECE0] bg-[#FAF7F5]/80 shrink-0">
        <button
          onClick={onLogout}
          className="group w-full flex items-center justify-center gap-2.5 px-3 py-2.5
                     text-xs sm:text-sm font-medium text-[#7E3540] bg-white hover:bg-[#7E3540] hover:text-white
                     border border-[#FAECE0] hover:border-[#7E3540] rounded-lg shadow-2xs
                     transition-all duration-200 active:scale-[0.99]"
        >
          <LogOut size={16} className="flex-shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
