import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'https://socialmedia-backend-r69i.onrender.com/';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true, secure: false },
      '/hubs': { target: apiTarget, changeOrigin: true, ws: true, secure: false },
    },
  },
});
