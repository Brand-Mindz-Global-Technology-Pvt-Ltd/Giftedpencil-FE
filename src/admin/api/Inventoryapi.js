import api from './axios.js';

export const inventoryApi = {
  getInventory: (params) => api.get('/api/admin/inventory', { params }),

  getProductStock: (productId) => api.get(`/api/admin/inventory/${productId}`),

  updateStock: (productId, stock) => api.patch(`/api/admin/inventory/${productId}/stock`, { stock }),

  getCategories: () => api.get('/api/categories'),
};
