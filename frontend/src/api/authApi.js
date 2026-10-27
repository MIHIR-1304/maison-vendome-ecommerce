import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/users/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/api/users/me', profileData);
    return response.data;
  },
};
