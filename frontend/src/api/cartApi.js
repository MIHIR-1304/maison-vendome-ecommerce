import apiClient from './client';

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/api/cart');
    return response.data;
  },

  addItem: async (productId, quantity = 1) => {
    const response = await apiClient.post('/api/cart/items', { productId, quantity });
    return response.data;
  },

  updateItem: async (productId, quantity) => {
    const response = await apiClient.patch(`/api/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeItem: async (productId) => {
    const response = await apiClient.delete(`/api/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/api/cart');
    return response.data;
  },
};
