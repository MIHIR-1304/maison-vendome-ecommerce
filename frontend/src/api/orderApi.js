import apiClient from './client';

const LOCAL_ORDERS_KEY = 'maison_vendome_patron_orders';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
};

export const orderApi = {
  checkout: async (checkoutData) => {
    try {
      const response = await apiClient.post('/api/orders/checkout', checkoutData);
      if (response?.data && response.data.id) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend order checkout unavailable, processing client checkout fallback:', err.message);
    }

    // Client-side fallback order generation
    let user = { id: 1, email: 'patron@vendome.fr', fullName: 'Valued Patron' };
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) user = JSON.parse(savedUser);
    } catch {
      // ignore
    }

    let items = [];
    let subtotal = 0;
    try {
      const savedCart = localStorage.getItem('maison_vendome_guest_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        items = parsed.items || [];
        subtotal = parsed.subtotal || 0;
      }
    } catch {
      // ignore
    }

    const freeShipping = subtotal >= 500;
    const shippingFee = freeShipping ? 0 : 25;
    const taxes = subtotal * 0.08;
    const totalAmount = Math.round((subtotal + shippingFee + taxes) * 100) / 100;

    const newOrder = {
      id: Date.now(),
      orderNumber: 'MV-' + Math.floor(100000 + Math.random() * 900000),
      userId: user.id || 1,
      customerEmail: user.email,
      customerName: user.fullName || 'VIP Patron',
      shippingAddress: checkoutData.shippingAddress || '12 Place Vendôme',
      city: checkoutData.city || 'Paris',
      postalCode: checkoutData.postalCode || '75001',
      country: checkoutData.country || 'France',
      totalAmount: totalAmount,
      status: 'PENDING_PAYMENT',
      paymentSessionId: 'sess_' + Date.now(),
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        id: i.id || Date.now(),
        productId: i.productId,
        productName: i.productName,
        imageUrl: i.imageUrl,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
    };

    const orders = getLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);

    return newOrder;
  },

  getOrders: async () => {
    try {
      const response = await apiClient.get('/api/orders');
      if (Array.isArray(response?.data)) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend orders unavailable, retrieving client orders:', err.message);
    }
    return getLocalOrders();
  },

  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/api/orders/${id}`);
      if (response?.data && response.data.id) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend order unavailable, retrieving client order snapshot:', err.message);
    }

    const orders = getLocalOrders();
    const found = orders.find((o) => o.id === Number(id) || o.orderNumber === id);
    if (found) return found;
    throw new Error('Consignment order not found in archive');
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/api/orders/${id}/status`, { status });
      if (response?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, updating local order status:', err.message);
    }

    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === Number(id));
    if (idx >= 0) {
      orders[idx].status = status;
      saveLocalOrders(orders);
      return orders[idx];
    }
    return { id, status };
  },
};
