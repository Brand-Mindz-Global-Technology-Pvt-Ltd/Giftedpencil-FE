import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  fetchBanners,
  createBanner,
  updateBanner,
  updateBannerStatus,
} from "../api/bannerapi.js";

const BannerContext = createContext(null);

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  const loadBanners = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchBanners(filters);
      if (res && res.data) {
        setBanners(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else if (Array.isArray(res)) {
        setBanners(res);
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  const addBanner = async (bannerData) => {
    const formData = bannerData instanceof FormData ? bannerData : new FormData();
    if (!(bannerData instanceof FormData)) {
      if (bannerData.image) formData.append("image", bannerData.image);
      if (bannerData.title) formData.append("title", bannerData.title);
      if (bannerData.subtitle) formData.append("subtitle", bannerData.subtitle);
      if (bannerData.cta_text) formData.append("cta_text", bannerData.cta_text);
      if (bannerData.cta_link) formData.append("cta_link", bannerData.cta_link);
      if (bannerData.sort_order !== undefined) formData.append("sort_order", bannerData.sort_order);
      if (bannerData.is_active !== undefined) formData.append("is_active", bannerData.is_active);
    }
    const res = await createBanner(formData);
    await loadBanners();
    return res;
  };

  const editBanner = async (id, bannerData) => {
    const formData = bannerData instanceof FormData ? bannerData : new FormData();
    if (!(bannerData instanceof FormData)) {
      if (bannerData.image) formData.append("image", bannerData.image);
      if (bannerData.title !== undefined) formData.append("title", bannerData.title);
      if (bannerData.subtitle !== undefined) formData.append("subtitle", bannerData.subtitle);
      if (bannerData.cta_text !== undefined) formData.append("cta_text", bannerData.cta_text);
      if (bannerData.cta_link !== undefined) formData.append("cta_link", bannerData.cta_link);
      if (bannerData.sort_order !== undefined) formData.append("sort_order", bannerData.sort_order);
      if (bannerData.is_active !== undefined) formData.append("is_active", bannerData.is_active);
    }
    const res = await updateBanner(id, formData);
    await loadBanners();
    return res;
  };

  const toggleStatus = async (id, nextStatus) => {
    const res = await updateBannerStatus(id, nextStatus);
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: nextStatus ? 1 : 0 } : b))
    );
    return res;
  };

  // Backward compatibility alias: soft deactivation instead of hard delete
  const removeBanner = async (id) => {
    return toggleStatus(id, false);
  };

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return (
    <BannerContext.Provider
      value={{
        banners,
        images: banners, // Backward compatibility alias
        loading,
        error,
        pagination,
        loadBanners,
        addBanner,
        editBanner,
        toggleStatus,
        removeBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) {
    throw new Error("useBanner must be used inside BannerProvider");
  }
  return ctx;
};
