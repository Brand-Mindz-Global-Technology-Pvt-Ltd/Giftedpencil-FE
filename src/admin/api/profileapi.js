import api from "./axios.js";

// Profile API methods
export const profileAPI = {
  getProfile: async (adminId) => {
    const response = await api.get(`/api/admin/auth/profile/${adminId}`);
    return response.data?.data || response.data?.admin || response.data || {};
  },
  // Update admin profile
  updateProfile: async (adminId, formData) => {
    const response = await api.put(`/admin/${adminId}/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data || response.data?.admin || response.data || {};
  },
  // Change password
  changePassword: async (adminId, passwordData) => {
    const response = await api.put(
      `/admin/${adminId}/change-password`,
      passwordData
    );
    return response.data;
  },
};

export default profileAPI;
