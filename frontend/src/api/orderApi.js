import apiClient from './client';

export const orderApi = {
  checkout: async (checkoutData) => {
    const response = await apiClient.post('/api/orders/checkout', checkoutData);
    return response.data;
  },

  getOrders: async () => {
    const response = await apiClient.get('/api/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  },
};
