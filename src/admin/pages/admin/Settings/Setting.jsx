import React, { useState } from "react";
import CompanySetting from "./CompanySetting.jsx";
import TermsSettings from "./TermsSettings.jsx";
import PrivacySettings from "./PrivacySettings.jsx";
import CookieSettings from "./CookieSettings.jsx";
import ShippingSettings from "./ShippingSettings.jsx";
import ReturnRefundSettings from "./ReturnRefundSettings.jsx";
import { Cookie, GlobeLock, Truck, RotateCcw } from "lucide-react"

const Setting = () => {
  const [active, setActive] = useState(null);

  const toggleSection = (section) => {
    setActive(active === section ? null : section);
  };

  const sections = [
    {
      id: "company",
      title: "Company Settings",
      description: "Manage your company profile and preferences",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      component: <CompanySetting />
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      description: "Manage your platform's terms and legal agreement",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      component: <TermsSettings />
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      description: "Manage data protection and privacy policies",
      icon: <GlobeLock className="w-5 h-5" />,
      component: <PrivacySettings />
    },
    {
      id: "shipping-policy",
      title: "Shipping & Delivery Policy",
      description: "Configure shipping timelines, methods, and delivery terms",
      icon: <Truck className="w-5 h-5" />,
      component: <ShippingSettings />
    },
    {
      id: "return-refund-policy",
      title: "Return & Refund Policy",
      description: "Manage customer return, refund, replacement and cancellation terms",
      icon: <RotateCcw className="w-5 h-5" />,
      component: <ReturnRefundSettings />
    },
    {
      id: "cookie-policy",
      title: "Cookie Policy",
      description: "Configure and manage website cookie policies",
      icon: <Cookie className="w-5 h-5" />,
      component: <CookieSettings />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 sm:py-4">
        {/* Header */}
        <div className="mb-3 sm:mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">
            Manage your account preferences and configurations
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white rounded-xl shadow-2xs border transition-all duration-200 hover:shadow-xs ${active === section.id
                ? "border-blue-300 ring-2 ring-blue-50"
                : "border-gray-200 hover:border-gray-300"
                }`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 text-left group"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${active === section.id
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-200"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                  >
                    {section.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2
                      className={`text-sm sm:text-base font-semibold transition-colors duration-150 truncate ${active === section.id
                        ? "text-blue-700"
                        : "text-gray-900 group-hover:text-gray-700"
                        }`}
                    >
                      {section.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Chevron Icon */}
                <div className="flex-shrink-0 ml-3">
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${active === section.id
                      ? "rotate-180 text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Section Content */}
              <div
                className={`transition-all duration-200 ease-in-out ${active === section.id
                  ? "max-h-[2500px] opacity-100"
                  : "max-h-0 opacity-0"
                  } overflow-hidden`}
              >
                <div className="px-3.5 sm:px-5 pb-5 pt-1">
                  <div className="border-t border-gray-100 pt-4">
                    {section.component}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;