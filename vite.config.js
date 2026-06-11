import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to your Django backend
      "/api": {
        target: "https://thdevops.co.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});