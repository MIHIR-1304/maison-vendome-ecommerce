import apiClient from './client';

export const paymentApi = {
  createSession: async (orderId) => {
    const response = await apiClient.post('/api/payments/checkout-session', { orderId });
    return response.data;
  },

  getPaymentBySession: async (sessionId) => {
    const response = await apiClient.get(`/api/payments/session/${sessionId}`);
    return response.data;
  },

  getPaymentByOrder: async (orderId) => {
    const response = await apiClient.get(`/api/payments/order/${orderId}`);
    return response.data;
  },

  completeMockPayment: async (sessionId, outcome = 'PAID') => {
    const response = await apiClient.post(`/api/payments/mock-complete/${sessionId}?outcome=${outcome}`);
    return response.data;
  },
};
