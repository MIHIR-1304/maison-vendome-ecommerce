import apiClient from './client';

export const productApi = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await apiClient.get(`/api/products/slug/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  },
};
