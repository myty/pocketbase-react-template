import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/pb": {
        target: "http://127.0.0.1:8090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pb/, ""),
      },
    },
  },
  plugins: [react()],
});
