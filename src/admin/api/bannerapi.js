import api from "./axios.js";

// Admin Banners API endpoints
const BANNER_API = "/api/admin/banners";

export const fetchBanners = async (params = {}) => {
  const response = await api.get(BANNER_API, { params });
  return response.data;
};

export const getBannerById = async (id) => {
  const response = await api.get(`${BANNER_API}/${id}`);
  return response.data;
};

export const createBanner = async (formData) => {
  const response = await api.post(BANNER_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBanner = async (id, formData) => {
  const response = await api.put(`${BANNER_API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBannerStatus = async (id, is_active) => {
  const response = await api.patch(`${BANNER_API}/${id}/status`, { is_active });
  return response.data;
};

// Aliases for backward compatibility
export const uploadBanner = createBanner;
export const deleteBanner = async (id) => updateBannerStatus(id, false);
