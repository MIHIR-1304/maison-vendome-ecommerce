import apiClient from './client';

const DEMO_USERS_KEY = 'maison_vendome_registered_patrons';

const getLocalPatrons = () => {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalPatrons = (patrons) => {
  try {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(patrons));
  } catch {
    // ignore
  }
};

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/api/users/login', credentials);
      if (response?.data && response.data.token) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable or returned error, evaluating client authentication:', err.message);
      // If error is actual 401/400 from backend, throw it
      if (err.response?.status === 401 || err.response?.status === 400) {
        throw err;
      }
    }

    // Client-side fallback authentication for standalone Vercel / Cloudflare deployments
    const email = credentials.email?.toLowerCase().trim();
    const password = credentials.password;

    // 1. Check built-in demo credentials
    if (
      (email === 'admin@aurastore.com' || email === 'admin@maisonvendome.com') &&
      (password === 'admin123' || password === 'Admin@123')
    ) {
      return {
        id: 1,
        email: email,
        fullName: 'Maison Director (Admin)',
        role: 'ADMIN',
        token: 'mv_demo_token_admin_' + Date.now(),
      };
    }

    if (
      (email === 'customer@aurastore.com' || email === 'customer@maisonvendome.com') &&
      (password === 'customer123' || password === 'Customer@123')
    ) {
      return {
        id: 2,
        email: email,
        fullName: 'Valued Connoisseur',
        role: 'CUSTOMER',
        token: 'mv_demo_token_customer_' + Date.now(),
      };
    }

    // 2. Check locally registered patrons
    const patrons = getLocalPatrons();
    const found = patrons.find((p) => p.email === email);
    if (found) {
      if (found.password === password) {
        return {
          id: found.id,
          email: found.email,
          fullName: found.fullName,
          role: found.role || 'CUSTOMER',
          token: found.token || 'mv_demo_token_' + Date.now(),
        };
      } else {
        throw new Error('Invalid email or password');
      }
    }

    // 3. Fallback: if not found, allow quick demo login
    return {
      id: Date.now(),
      email: email,
      fullName: email.split('@')[0].toUpperCase(),
      role: 'CUSTOMER',
      token: 'mv_demo_token_' + Date.now(),
    };
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/users/register', userData);
      if (response?.data && response.data.token) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable or returned error, evaluating client registration fallback:', err.message);
      // If error is 409 conflict (email exists) from real backend, rethrow
      if (err.response?.status === 409) {
        throw err;
      }
    }

    // Client-side fallback registration for standalone deployments
    const email = userData.email?.toLowerCase().trim();
    const patrons = getLocalPatrons();

    const existing = patrons.find((p) => p.email === email);
    if (existing) {
      throw new Error(`Email is already registered with Maison Vendôme: ${email}`);
    }

    const newPatron = {
      id: Date.now(),
      email: email,
      fullName: userData.fullName || 'Valued Patron',
      password: userData.password,
      role: 'CUSTOMER',
      address: userData.address || '',
      city: userData.city || 'Paris',
      postalCode: userData.postalCode || '75001',
      country: userData.country || 'France',
      token: 'mv_patron_token_' + Date.now(),
    };

    patrons.push(newPatron);
    saveLocalPatrons(patrons);

    return {
      id: newPatron.id,
      email: newPatron.email,
      fullName: newPatron.fullName,
      role: newPatron.role,
      token: newPatron.token,
    };
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/users/me');
      if (response?.data && response.data.email) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend profile unavailable, using local session profile:', err.message);
    }

    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const patrons = getLocalPatrons();
        const found = patrons.find((p) => p.email === parsed.email);
        if (found) {
          return {
            id: found.id,
            email: found.email,
            fullName: found.fullName,
            role: found.role,
            address: found.address,
            city: found.city,
            postalCode: found.postalCode,
            country: found.country,
          };
        }
        return {
          id: parsed.id || 1,
          email: parsed.email || 'guest@vendome.fr',
          fullName: parsed.fullName || 'VIP Patron',
          role: parsed.role || 'CUSTOMER',
          address: '12 Place Vendôme',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        };
      }
    } catch {
      // ignore
    }

    return {
      id: 1,
      email: 'patron@vendome.fr',
      fullName: 'VIP Patron',
      role: 'CUSTOMER',
      address: '12 Place Vendôme',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    };
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch('/api/users/me', profileData);
      if (response?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, updating client patron profile:', err.message);
    }

    try {
      const saved = localStorage.getItem('user');
      const currentUser = saved ? JSON.parse(saved) : {};
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const patrons = getLocalPatrons();
      const idx = patrons.findIndex((p) => p.email === currentUser.email);
      if (idx >= 0) {
        patrons[idx] = { ...patrons[idx], ...profileData };
        saveLocalPatrons(patrons);
      }
      return updatedUser;
    } catch {
      return profileData;
    }
  },
};
