import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const SECTIONS = ["sales", "satisfaction", "volume", "revenue", "products"];

const ENDPOINTS = {
  sales:        { endpoint: "sales-summary",         delay: 50  },
  satisfaction: { endpoint: "customer-satisfaction", delay: 50 },
  volume:       { endpoint: "volume-service",        delay: 50 },
  revenue:      { endpoint: "revenue",               delay: 50 },
  products:     { endpoint: "top-products",          delay: 50 },
};

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(
    Object.fromEntries(SECTIONS.map((k) => [k, true]))
  );
  const [data, setData] = useState(
    Object.fromEntries(SECTIONS.map((k) => [k, null]))
  );

  useEffect(() => {
    const fetchSection = async (key) => {
      const { endpoint, delay } = ENDPOINTS[key];
      try {
        const { data: json } = await api.get(`/api/admin/dashboard/${endpoint}`);
        setTimeout(() => {
          setData((d) => ({ ...d, [key]: json }));
          setLoading((l) => ({ ...l, [key]: false }));
        }, delay);
      } catch (err) {
        console.error(`[${key}] API error:`, err.response?.data?.message || err.message);
        setTimeout(() => setLoading((l) => ({ ...l, [key]: false })), delay);
      }
    };

    SECTIONS.forEach(fetchSection);
  }, []);

  return (
    <DashboardContext.Provider value={{ loading, data }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return ctx;
};