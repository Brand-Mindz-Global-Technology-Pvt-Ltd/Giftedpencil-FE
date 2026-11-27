import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Menu,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../layout/navItems";
import { useProfile } from "../context/ProfileContext";

const DEFAULT_AVATAR =
  "https://randomuser.me/api/portraits/men/32.jpg";

function findTitle(pathname) {
  for (const item of navItems) {
    if (item.to && pathname.startsWith(item.to)) {
      return item.label;
    }
    if (item.children) {
      const child = item.children.find((c) =>
        pathname.startsWith(c.to)
      );
      if (child) return child.label;
    }
  }
  return "Dashboard";
}

export default function Topbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role, username } = useProfile();
  const [openSearch, setOpenSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [mobileFilteredItems, setMobileFilteredItems] = useState([]);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const title = useMemo(
    () => findTitle(location.pathname),
    [location.pathname]
  );

  /* -------------------- CURRENT AUTH DATA -------------------- */
  const currentAdmin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "{}");
    } catch {
      return {};
    }
  }, []);

  const displayName = useMemo(() => {
    const raw =
      username ||
      profile?.username ||
      profile?.full_name ||
      profile?.name ||
      currentAdmin?.username ||
      currentAdmin?.full_name ||
      currentAdmin?.name ||
      (currentAdmin?.email ? currentAdmin.email.split("@")[0] : "");
    if (!raw || raw === "undefined undefined" || raw === "null") {
      return "Admin";
    }
    return raw;
  }, [username, profile, currentAdmin]);

  const displayRole = useMemo(() => {
    return role || currentAdmin?.role || "Administrator";
  }, [role, currentAdmin]);

  const displayEmail = useMemo(() => {
    return profile?.email || currentAdmin?.email || "";
  }, [profile, currentAdmin]);

  /* -------------------- GET ADMIN ID -------------------- */
  const getAdminId = () => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");
      return admin.id || "";
    } catch (err) {
      console.error("Failed to get admin ID:", err);
      return "";
    }
  };

  /* -------------------- FLATTEN NAV ITEMS -------------------- */
  const allNavItems = useMemo(() => {
    const items = [];
    navItems.forEach((item) => {
      if (item.to) {
        items.push({ label: item.label, to: item.to });
      }
      if (item.children) {
        item.children.forEach((child) => {
          items.push({ label: child.label, to: child.to });
        });
      }
    });
    return items;
  }, []);

  /* -------------------- DESKTOP SEARCH FILTER -------------------- */
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allNavItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery, allNavItems]);

  /* -------------------- MOBILE SEARCH FILTER -------------------- */
  useEffect(() => {
    if (mobileSearchQuery.trim()) {
      const filtered = allNavItems.filter((item) =>
        item.label.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      );
      setMobileFilteredItems(filtered);
    } else {
      setMobileFilteredItems([]);
    }
  }, [mobileSearchQuery, allNavItems]);

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFilteredItems([]);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  };

  const handleProfileNavigate = () => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");
      if (!admin.id) return;
      navigate(`/admin/profile?id=${admin.id}`);
      setOpenProfile(false);
    } catch (err) {
      console.error("Failed to navigate to profile:", err);
    }
  };

  /* -------------------- HANDLE SEARCH NAVIGATION -------------------- */
  const handleSearchNavigation = (path) => {
    const adminId = getAdminId();
    if (adminId) {
      navigate(`${path}?id=${adminId}`);
    } else {
      navigate(path);
    }
    setSearchQuery("");
    setFilteredItems([]);
  };

  /* -------------------- HANDLE MOBILE SEARCH NAVIGATION -------------------- */
  const handleMobileSearchNavigation = (path) => {
    const adminId = getAdminId();
    if (adminId) {
      navigate(`${path}?id=${adminId}`);
    } else {
      navigate(path);
    }
    setMobileSearchQuery("");
    setMobileFilteredItems([]);
    setOpenSearch(false);
  };

  /* -------------------- CLOSE MOBILE SEARCH -------------------- */
  const closeMobileSearch = () => {
    setOpenSearch(false);
    setMobileSearchQuery("");
    setMobileFilteredItems([]);
  };

  /* -------------------- SAFE DATA EXTRACTION -------------------- */
  const profileImage =
    profile?.profileImage?.url || DEFAULT_AVATAR;

  return (
    <>
      <header className="h-14 bg-white border border-[#FAECE0] rounded-xl shadow-2xs flex items-center justify-between px-3 sm:px-4 sticky top-0 z-30 transition-all">
        {/* ===== Left: Mobile Menu & Current Title ===== */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onMenu && (
            <button
              onClick={onMenu}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[#FAF7F5] text-slate-700 hover:text-[#7E3540] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>
          )}
          <h1 className="text-sm sm:text-base font-semibold text-[#1E293B] tracking-tight truncate">
            {title}
          </h1>
        </div>

        {/* ===== Center Search (Desktop) ===== */}
        <div className="hidden md:flex flex-1 justify-center px-4" ref={searchRef}>
          <div className="relative w-full max-w-sm">
            <div className="flex items-center w-full bg-[#FAF7F5] hover:bg-[#FFF7F1] rounded-full px-3 py-1.5 border border-[#FAECE0] focus-within:border-[#7E3540] focus-within:ring-2 focus-within:ring-[#7E3540]/10 focus-within:bg-white transition-all">
              <Search size={14} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search menu..."
                className="bg-transparent outline-none text-xs sm:text-sm w-full placeholder:text-slate-400 text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {filteredItems.length > 0 && (
              <div className="absolute top-full mt-1.5 w-full bg-white rounded-xl shadow-lg border border-[#FAECE0] z-50 max-h-60 overflow-y-auto p-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchNavigation(item.to)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#FFF7F1] hover:text-[#7E3540] rounded-lg transition-colors text-left"
                  >
                    <Search size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== Right: Mobile Search & Admin User Profile ===== */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setOpenSearch(true)}
            className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[#FAF7F5] text-slate-600 hover:text-[#7E3540] transition-colors"
            title="Search"
          >
            <Search size={16} />
          </button>

          {/* ===== Profile Dropdown ===== */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setOpenProfile((p) => !p)}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-[#FAF7F5] select-none border border-transparent hover:border-[#FAECE0] transition-colors"
              title={`Logged in as ${displayName}`}
            >
              <img
                src={profileImage}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover border border-[#FAECE0] shadow-2xs shrink-0"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />

              <div className="flex flex-col text-left leading-tight min-w-0 max-w-[100px] xs:max-w-[130px] sm:max-w-[160px]">
                <span className="text-xs sm:text-sm font-semibold text-[#1E293B] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-[#64748B] truncate font-medium">
                  {displayRole}
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform duration-200 shrink-0 ${
                  openProfile ? "rotate-180 text-[#7E3540]" : ""
                }`}
              />
            </div>

            {openProfile && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#FAECE0] z-50 overflow-hidden py-1 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-[#FAECE0] bg-[#FAF7F5]/80">
                  <p className="text-xs font-semibold text-[#1E293B] truncate">{displayName}</p>
                  {displayEmail && (
                    <p className="text-[11px] text-[#64748B] truncate">{displayEmail}</p>
                  )}
                </div>

                <button
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#FFF7F1] hover:text-[#7E3540] transition-colors"
                  onClick={handleProfileNavigate}
                >
                  <User size={15} className="text-slate-500 shrink-0" />
                  <span>Profile</span>
                </button>

                <div className="border-t border-[#FAECE0] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs sm:text-sm text-[#7E3540] hover:bg-[#FFF7F1] transition-colors font-medium"
                >
                  <LogOut size={15} className="shrink-0" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== Mobile Search Overlay ===== */}
      {openSearch && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={closeMobileSearch}
        >
          <div
            className="bg-white w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Search Header */}
            <div className="flex items-center gap-3 p-3 border-b border-[#FAECE0]">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search menu..."
                className="flex-1 outline-none text-sm text-[#1E293B] placeholder:text-slate-400"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
              />
              <button
                onClick={closeMobileSearch}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#FAF7F5] text-slate-600 hover:text-[#7E3540]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Search Results */}
            <div className="flex-1 overflow-y-auto bg-[#FAF7F5] p-3">
              {mobileFilteredItems.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide px-2 mb-2">
                    Search Results ({mobileFilteredItems.length})
                  </p>
                  {mobileFilteredItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMobileSearchNavigation(item.to)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[#1E293B] bg-white hover:bg-[#FFF7F1] hover:text-[#7E3540] border border-[#FAECE0] rounded-lg transition-all shadow-2xs"
                    >
                      <Search size={15} className="text-slate-400 shrink-0" />
                      <span className="font-medium text-left flex-1 truncate">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : mobileSearchQuery.trim() ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No matching menu items found.
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Type a menu name to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
