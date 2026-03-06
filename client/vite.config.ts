import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      tsconfig: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@todo/shared": path.resolve(__dirname, "../shared/types.ts"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});