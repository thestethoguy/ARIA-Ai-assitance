import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ─── Dev Server ───────────────────────────────────────────────────────────────
  server: {
    port: 5173,
    proxy: {
      // In development, proxy /api/* → Express backend on :5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ─── Path Aliases ─────────────────────────────────────────────────────────────
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ─── Build ────────────────────────────────────────────────────────────────────
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Split heavy vendor dependencies into separate cached chunks
        manualChunks: (id) => {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
