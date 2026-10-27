import apiClient from './client';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '../data/fallbackData';

export const productApi = {
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/products', { params });
      if (response?.data && Array.isArray(response.data.content)) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable or returned invalid response, using curated client fallback:', err.message);
    }

    // Client-side fallback computation for standalone deployments (Vercel / Cloudflare)
    let list = [...FALLBACK_PRODUCTS];

    if (params.categoryId) {
      list = list.filter((p) => p.category?.id === Number(params.categoryId));
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (params.minPrice) {
      list = list.filter((p) => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      list = list.filter((p) => p.price <= Number(params.maxPrice));
    }

    if (params.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params.sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sortBy === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    const page = params.page ? Number(params.page) : 0;
    const size = params.size ? Number(params.size) : 24;
    const start = page * size;
    const paginated = list.slice(start, start + size);

    return {
      content: paginated,
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size),
      size: size,
      number: page,
    };
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      if (response?.data && response.data.id) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, retrieving from client fallback:', err.message);
    }

    const found = FALLBACK_PRODUCTS.find((p) => p.id === Number(id));
    if (found) return found;
    throw new Error('Creation not found in archive');
  },

  getProductBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/api/products/slug/${slug}`);
      if (response?.data && response.data.slug) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, retrieving from client fallback:', err.message);
    }

    const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (found) return found;
    throw new Error('Creation not found in archive');
  },

  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/categories');
      if (Array.isArray(response?.data)) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, using curated category fallback:', err.message);
    }
    return FALLBACK_CATEGORIES;
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
