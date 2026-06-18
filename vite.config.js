import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ==========================================
  // 1. LOCAL DEVELOPMENT SERVER (Safe Proxying)
  // ==========================================
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Forward API requests to your new Django backend
      "/api": {
        target: "https://ab-hrms.in",
        changeOrigin: true,
        secure: false,
      },
      // CRITICAL: Forward Media requests so profile pics & PDFs work in local dev!
      "/media": {
        target: "https://ab-hrms.in",
        changeOrigin: true,
        secure: false,
      },
      // Forward Static requests
      "/static": {
        target: "https://ab-hrms.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ==========================================
  // 2. PRODUCTION BUILD OPTIMIZATIONS (Fast Loading)
  // ==========================================
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Smart Chunking: Splits code so returning users load the site instantly
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor-react";
            }
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
