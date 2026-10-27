import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api/users': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/products': { target: 'http://localhost:8082', changeOrigin: true },
      '/api/categories': { target: 'http://localhost:8082', changeOrigin: true },
      '/api/cart': { target: 'http://localhost:8083', changeOrigin: true },
      '/api/orders': { target: 'http://localhost:8084', changeOrigin: true },
      '/api/payments': { target: 'http://localhost:8085', changeOrigin: true },
      '/api/notifications': { target: 'http://localhost:8086', changeOrigin: true },
    }
  }
});
