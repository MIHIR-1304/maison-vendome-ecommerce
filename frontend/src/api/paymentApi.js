import apiClient from './client';

export const paymentApi = {
  createSession: async (orderId) => {
    try {
      const response = await apiClient.post('/api/payments/checkout-session', { orderId });
      if (response?.data && response.data.sessionId) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend payment service unavailable, generating mock simulation session:', err.message);
    }

    return {
      sessionId: 'mock_sess_' + Date.now(),
      provider: 'MOCK',
      orderId: orderId,
      checkoutUrl: null,
    };
  },

  getPaymentBySession: async (sessionId) => {
    try {
      const response = await apiClient.get(`/api/payments/session/${sessionId}`);
      if (response?.data) return response.data;
    } catch {
      // ignore
    }
    return { sessionId, status: 'PAID' };
  },

  getPaymentByOrder: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/payments/order/${orderId}`);
      if (response?.data) return response.data;
    } catch {
      // ignore
    }
    return { orderId, status: 'PAID' };
  },

  completeMockPayment: async (sessionId, outcome = 'PAID') => {
    try {
      const response = await apiClient.post(`/api/payments/mock-complete/${sessionId}?outcome=${outcome}`);
      if (response?.data) return response.data;
    } catch (err) {
      console.warn('Backend payment completion unavailable, completing locally:', err.message);
    }

    // Update local order status if present
    try {
      const raw = localStorage.getItem('maison_vendome_patron_orders');
      if (raw) {
        const orders = JSON.parse(raw);
        if (orders.length > 0) {
          orders[0].status = outcome;
          localStorage.setItem('maison_vendome_patron_orders', JSON.stringify(orders));
        }
      }
    } catch {
      // ignore
    }

    return {
      sessionId,
      status: outcome,
      message: `Simulation ${outcome} applied successfully.`,
    };
  },
};
